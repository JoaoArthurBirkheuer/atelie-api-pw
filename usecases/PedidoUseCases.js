const { pool } = require('../config');
const Pedido = require('../entities/Pedido');
const ItemPedido = require('../entities/ItemPedido');

const STATUS_PERMITIDOS = ['PENDENTE', 'CANCELADO', 'ENTREGUE'];

class PedidoUseCases {
  static async getPedidos() {
    const { rows } = await pool.query(`
      SELECT p.*, c.nome AS cliente_nome, v.nome AS vendedor_nome
      FROM tb_pedidos p
      JOIN tb_clientes c ON p.cliente_id = c.cliente_id
      JOIN tb_vendedores v ON p.vendedor_id = v.vendedor_id
      ORDER BY p.data_pedido DESC
    `);
    return rows.map(row => ({
      ...new Pedido(row),
      cliente: { nome: row.cliente_nome },
      vendedor: { nome: row.vendedor_nome }
    }));
  }

  static async getPedidoPorId(id) {
    const pedidoQuery = `
      SELECT p.*, c.nome AS cliente_nome, v.nome AS vendedor_nome
      FROM tb_pedidos p
      JOIN tb_clientes c ON p.cliente_id = c.cliente_id
      JOIN tb_vendedores v ON p.vendedor_id = v.vendedor_id
      WHERE p.pedido_id = $1
    `;
    const pedidoResult = await pool.query(pedidoQuery, [id]);

    if (pedidoResult.rowCount === 0) throw new Error('Pedido não encontrado');

    const itens = await this.getItensPorPedido(id);

    return {
      ...new Pedido(pedidoResult.rows[0]),
      cliente: { nome: pedidoResult.rows[0].cliente_nome },
      vendedor: { nome: pedidoResult.rows[0].vendedor_nome },
      itens
    };
  }

  static async addPedidoComItens(pedidoData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { cliente_id, vendedor_id, status = 'PENDENTE', itens } = pedidoData;

      if (!Array.isArray(itens)) throw new Error('Lista de itens inválida');
      if (itens.length === 0) throw new Error('Pedido deve conter pelo menos um item');

      const valor_total = itens.reduce((total, item) =>
        total + (item.preco_venda * item.quantidade * (1 - (item.desconto_pct || 0) / 100)), 0);

      const pedidoResult = await client.query(
        `INSERT INTO tb_pedidos 
         (cliente_id, vendedor_id, data_pedido, status, valor_total)
         VALUES ($1, $2, $3, $4, $5) RETURNING pedido_id`,
        [cliente_id, vendedor_id, new Date(), status.toUpperCase(), valor_total]
      );

      const pedido_id = pedidoResult.rows[0].pedido_id;

      for (const item of itens) {
        await this._addItemPedido(client, { ...item, pedido_id });
      }

      await client.query('COMMIT');
      return await this.getPedidoPorId(pedido_id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async _addItemPedido(client, { pedido_id, peca_id, quantidade, preco_venda, desconto_pct = 0 }) {
    if (!pedido_id || !peca_id || !quantidade || !preco_venda) {
      throw new Error('Dados incompletos para adicionar item');
    }

    const { rows } = await client.query(
      `INSERT INTO tb_item_pedido 
      (pedido_id, peca_id, quantidade, preco_venda, desconto_pct)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [pedido_id, peca_id, quantidade, preco_venda, desconto_pct]
    );

    return new ItemPedido(rows[0]);
  }

  static async getItensPorPedido(pedidoId) {
    if (!pedidoId || isNaN(pedidoId)) {
      throw new Error('ID do pedido inválido');
    }

    const { rows } = await pool.query(
      `SELECT ip.*, p.nome AS peca_nome
       FROM tb_item_pedido ip
       JOIN tb_pecas p ON ip.peca_id = p.peca_id
       WHERE ip.pedido_id = $1`,
      [Number(pedidoId)]
    );
    return rows.map(row => new ItemPedido(row));
  }

  static async updatePedidoStatus(pedidoId, novoStatus) {
    if (!STATUS_PERMITIDOS.includes(novoStatus)) {
      throw new Error(`Status inválido. Valores permitidos: ${STATUS_PERMITIDOS.join(', ')}`);
    }

    const { rows } = await pool.query(
      `UPDATE tb_pedidos SET status = $1 
       WHERE pedido_id = $2 RETURNING *`,
      [novoStatus, pedidoId]
    );

    if (rows.length === 0) throw new Error('Pedido não encontrado');
    return new Pedido(rows[0]);
  }

  static async deletePedido(pedidoId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM tb_item_pedido WHERE pedido_id = $1', [pedidoId]);
      const { rowCount } = await client.query('DELETE FROM tb_pedidos WHERE pedido_id = $1', [pedidoId]);

      if (rowCount === 0) throw new Error('Pedido não encontrado');
      await client.query('COMMIT');

      return { success: true, message: 'Pedido removido com sucesso' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = PedidoUseCases;

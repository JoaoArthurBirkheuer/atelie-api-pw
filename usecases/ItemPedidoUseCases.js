const { pool } = require('../config');
const ItemPedido = require('../entities/ItemPedido');

class ItemPedidoUseCases {
  static async getItensPedido() {
    const { rows } = await pool.query('SELECT * FROM tb_item_pedido');
    return rows.map(row => new ItemPedido(row));
  }

  static async getItemPedidoPorId(id) {
    const { rows } = await pool.query(
      'SELECT * FROM tb_item_pedido WHERE item_id = $1',
      [id]
    );
    if (rows.length === 0) throw new Error('Item de pedido não encontrado');
    return new ItemPedido(rows[0]);
  }

  static async addItemPedido({ pedido_id, peca_id, quantidade, preco_venda, desconto_pct = 0 }) {
    if (!pedido_id || !peca_id || !quantidade || !preco_venda) {
      throw new Error('Dados incompletos para adicionar item');
    }

    const { rows } = await pool.query(
      `INSERT INTO tb_item_pedido 
      (pedido_id, peca_id, quantidade, preco_venda, desconto_pct)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [pedido_id, peca_id, quantidade, preco_venda, desconto_pct]
    );
    return new ItemPedido(rows[0]);
  }

  static async updateItemPedido({ item_id, ...dados }) {
    const campos = Object.keys(dados).filter(key => dados[key] !== undefined);
    if (campos.length === 0) throw new Error('Nenhum dado válido para atualização');

    const valores = campos.map(key => dados[key]);
    const setClause = campos.map((key, i) => `${key} = $${i + 1}`).join(', ');

    const { rows } = await pool.query(
      `UPDATE tb_item_pedido SET ${setClause} 
       WHERE item_id = $${campos.length + 1} RETURNING *`,
      [...valores, item_id]
    );

    if (rows.length === 0) throw new Error('Item de pedido não encontrado');
    return new ItemPedido(rows[0]);
  }

  static async deleteItemPedido(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM tb_item_pedido WHERE item_id = $1',
      [id]
    );
    if (rowCount === 0) throw new Error('Item de pedido não encontrado');
    return { success: true, message: 'Item removido com sucesso' };
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
}

module.exports = ItemPedidoUseCases;
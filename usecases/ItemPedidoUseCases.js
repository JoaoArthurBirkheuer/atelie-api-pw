const { pool } = require('../config');
const ItemPedido = require('../entities/ItemPedido');

async function getItensPedidoDB() {
  const { rows } = await pool.query('SELECT * FROM tb_item_pedido');
  return rows.map(row => new ItemPedido(row));
}

async function getItemPedidoPorIdDB(id) {
  const { rows } = await pool.query(
    'SELECT * FROM tb_item_pedido WHERE item_id = $1',
    [id]
  );
  if (rows.length === 0) throw new Error('Item de pedido não encontrado');
  return new ItemPedido(rows[0]);
}

async function addItemPedidoDB({ pedido_id, peca_id, quantidade, preco_venda, desconto_pct }) {
  const { rows } = await pool.query(
    `INSERT INTO tb_item_pedido 
    (pedido_id, peca_id, quantidade, preco_venda, desconto_pct)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [pedido_id, peca_id, quantidade, preco_venda, desconto_pct]
  );
  return new ItemPedido(rows[0]);
}

async function updateItemPedidoDB({ item_id, pedido_id, peca_id, quantidade, preco_venda, desconto_pct }) {
  const { rows } = await pool.query(
    `UPDATE tb_item_pedido SET 
     pedido_id = $1, peca_id = $2, quantidade = $3, preco_venda = $4, desconto_pct = $5
     WHERE item_id = $6 RETURNING *`,
    [pedido_id, peca_id, quantidade, preco_venda, desconto_pct, item_id]
  );
  if (rows.length === 0) throw new Error('Item de pedido não encontrado');
  return new ItemPedido(rows[0]);
}

async function deleteItemPedidoDB(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM tb_item_pedido WHERE item_id = $1',
    [id]
  );
  if (rowCount === 0) throw new Error('Item de pedido não encontrado');
  return 'Item de pedido excluído com sucesso';
}

async function getItensPorPedidoDB(pedido_id) {
  const { rows } = await pool.query(
    'SELECT * FROM tb_item_pedido WHERE pedido_id = $1',
    [pedido_id]
  );
  return rows.map(row => new ItemPedido(row));
}

module.exports = {
  getItensPedidoDB,
  getItemPedidoPorIdDB,
  addItemPedidoDB,
  updateItemPedidoDB,
  deleteItemPedidoDB,
  getItensPorPedidoDB
};

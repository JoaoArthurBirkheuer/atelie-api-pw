const { pool } = require('../config');
const Pedido = require('../entities/Pedido');

async function getPedidosDB() {
  const { rows } = await pool.query('SELECT * FROM tb_pedidos');
  return rows.map(row => new Pedido(row));
}

async function getPedidoPorIdDB(id) {
  const { rows } = await pool.query(
    'SELECT * FROM tb_pedidos WHERE pedido_id = $1',
    [id]
  );
  if (rows.length === 0) throw new Error('Pedido não encontrado');
  return new Pedido(rows[0]);
}

async function addPedidoDB({ cliente_id, vendedor_id, data_pedido, status, valor_total }) {
  const { rows } = await pool.query(
    `INSERT INTO tb_pedidos (cliente_id, vendedor_id, data_pedido, status, valor_total)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [cliente_id, vendedor_id, data_pedido, status, valor_total]
  );
  return new Pedido(rows[0]);
}

async function updatePedidoDB({ pedido_id, cliente_id, vendedor_id, data_pedido, status, valor_total }) {
  const { rows } = await pool.query(
    `UPDATE tb_pedidos SET 
     cliente_id = $1, vendedor_id = $2, data_pedido = $3, status = $4, valor_total = $5
     WHERE pedido_id = $6 RETURNING *`,
    [cliente_id, vendedor_id, data_pedido, status, valor_total, pedido_id]
  );
  if (rows.length === 0) throw new Error('Pedido não encontrado');
  return new Pedido(rows[0]);
}

async function deletePedidoDB(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM tb_pedidos WHERE pedido_id = $1',
    [id]
  );
  if (rowCount === 0) throw new Error('Pedido não encontrado');
  return 'Pedido excluído com sucesso';
}

module.exports = {
  getPedidosDB,
  getPedidoPorIdDB,
  addPedidoDB,
  updatePedidoDB,
  deletePedidoDB,
};

const { pool } = require('../config.js');
const Cliente = require('../entities/Cliente.js');

async function getClientesDB() {
  const { rows } = await pool.query(
    'SELECT cliente_id, nome, email, telefone, endereco FROM tb_clientes'
  );
  return rows.map(row => new Cliente(row));
}

async function getClientePorIdDB(id) {
  const { rows } = await pool.query(
    'SELECT cliente_id, nome, email, telefone, endereco FROM tb_clientes WHERE cliente_id = $1',
    [id]
  );
  if (rows.length === 0) throw new Error('Cliente não encontrado');
  return new Cliente(rows[0]);
}

async function addClienteDB({ nome, email, telefone, endereco }) {
  const { rows } = await pool.query(
    'INSERT INTO tb_clientes (nome, email, telefone, endereco) VALUES ($1, $2, $3, $4) RETURNING cliente_id, nome, email, telefone, endereco',
    [nome, email, telefone, endereco]
  );
  return new Cliente(rows[0]);
}

async function updateClienteDB({ cliente_id, nome, email, telefone, endereco }) {
  const { rows } = await pool.query(
    'UPDATE tb_clientes SET nome = $1, email = $2, telefone = $3, endereco = $4 WHERE cliente_id = $5 RETURNING cliente_id, nome, email, telefone, endereco',
    [nome, email, telefone, endereco, cliente_id]
  );
  if (rows.length === 0) throw new Error('Cliente não encontrado');
  return new Cliente(rows[0]);
}

async function deleteClienteDB(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM tb_clientes WHERE cliente_id = $1',
    [id]
  );
  if (rowCount === 0) throw new Error('Cliente não encontrado');
  return 'Cliente excluído com sucesso';
}

module.exports = {
  getClientesDB,
  getClientePorIdDB,
  addClienteDB,
  updateClienteDB,
  deleteClienteDB,
};

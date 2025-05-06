const { pool } = require('../config');
const Cliente = require('../entities/Cliente');
const bcrypt = require('bcrypt');

async function getClientesDB() {
  const { rows } = await pool.query('SELECT * FROM tb_clientes');
  return rows.map(row => {
    delete row.senha; // remove a senha do objeto
    return new Cliente(row);
  });
}

async function getClientePorIdDB(cliente_id) {
  const { rows } = await pool.query('SELECT * FROM tb_clientes WHERE cliente_id = $1', [cliente_id]);
  if (rows.length === 0) throw new Error('Cliente não encontrado');
  delete rows[0].senha;
  return new Cliente(rows[0]);
}

async function getClientePorEmailDB(email) {
  const { rows } = await pool.query('SELECT * FROM tb_clientes WHERE email = $1', [email]);
  if (rows.length === 0) throw new Error('Cliente não encontrado');
  delete rows[0].senha;
  return new Cliente(rows[0]);
}

async function getPedidosPorClienteDB(clienteId) {
  const { rows } = await pool.query(`
    SELECT p.* 
    FROM tb_pedidos p
    WHERE p.cliente_id = $1
    ORDER BY p.data_pedido DESC
  `, [clienteId]);
  
  return rows.map(row => new Pedido(row));
}

async function addClienteDB({ nome, email, telefone, endereco, senha }) {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const { rows } = await pool.query(
    'INSERT INTO tb_clientes (nome, email, telefone, endereco, senha) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, email, telefone, endereco, hashedPassword]
  );
  delete rows[0].senha;
  return new Cliente(rows[0]);
}

async function updateClienteDB({ cliente_id, nome, email, telefone, endereco, senha }) {
  let query;
  let values;

  if (senha) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    query = `
      UPDATE tb_clientes 
      SET nome=$1, email=$2, telefone=$3, endereco=$4, senha=$5 
      WHERE cliente_id=$6 
      RETURNING *
    `;
    values = [nome, email, telefone, endereco, hashedPassword, cliente_id];
  } else {
    query = `
      UPDATE tb_clientes 
      SET nome=$1, email=$2, telefone=$3, endereco=$4 
      WHERE cliente_id=$5 
      RETURNING *
    `;
    values = [nome, email, telefone, endereco, cliente_id];
  }

  const { rows } = await pool.query(query, values);
  if (rows.length === 0) throw new Error('Cliente não encontrado');
  delete rows[0].senha;
  return new Cliente(rows[0]);
}

async function deleteClienteDB(cliente_id) {
  const { rows } = await pool.query('DELETE FROM tb_clientes WHERE cliente_id = $1 RETURNING *', [cliente_id]);
  if (rows.length === 0) throw new Error('Cliente não encontrado');
  delete rows[0].senha;
  return new Cliente(rows[0]);
}

module.exports = {
  getClientesDB,
  getClientePorIdDB,
  getClientePorEmailDB,
  addClienteDB,
  updateClienteDB,
  deleteClienteDB,
  getPedidosPorClienteDB
};

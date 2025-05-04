const { pool } = require('../config');
const Vendedor = require('../entities/Vendedor');

async function getVendedoresDB() {
  const { rows } = await pool.query(
    'SELECT vendedor_id, nome, email, telefone, data_admissao FROM tb_vendedores'
  );
  return rows.map(row => new Vendedor(row));
}

async function getVendedorPorIdDB(id) {
  const { rows } = await pool.query(
    'SELECT vendedor_id, nome, email, telefone, data_admissao FROM tb_vendedores WHERE vendedor_id = $1',
    [id]
  );
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  return new Vendedor(rows[0]);
}

async function addVendedorDB({ nome, email, telefone, data_admissao, senha }) {
  const { rows } = await pool.query(
    'INSERT INTO tb_vendedores (nome, email, telefone, data_admissao, senha) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, email, telefone, data_admissao, senha]
  );
  return new Vendedor(rows[0]);
}

async function updateVendedorDB({ vendedor_id, nome, email, telefone, data_admissao, senha }) {
  const { rows } = await pool.query(
    'UPDATE tb_vendedores SET nome=$1, email=$2, telefone=$3, data_admissao=$4, senha=$5 WHERE vendedor_id=$6 RETURNING *',
    [nome, email, telefone, data_admissao, senha, vendedor_id]
  );
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  return new Vendedor(rows[0]);
}

async function deleteVendedorDB(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM tb_vendedores WHERE vendedor_id = $1',
    [id]
  );
  if (rowCount === 0) throw new Error('Vendedor não encontrado');
  return 'Vendedor excluído com sucesso';
}

async function getVendedorPorEmailDB(email) {
  const { rows } = await pool.query(
    'SELECT * FROM tb_vendedores WHERE email = $1',
    [email]
  );
  return rows[0];
}

module.exports = {
  getVendedoresDB,
  getVendedorPorIdDB,
  addVendedorDB,
  updateVendedorDB,
  deleteVendedorDB,
  getVendedorPorEmailDB
};

const { pool } = require('../config');
const Vendedor = require('../entities/Vendedor');
const bcrypt = require('bcrypt');

async function getVendedoresDB() {
  const { rows } = await pool.query('SELECT * FROM tb_vendedores');
  return rows.map(row => {
    delete row.senha;
    return new Vendedor(row);
  });
}

async function getVendedorPorIdDB(vendedor_id) {
  const { rows } = await pool.query('SELECT * FROM tb_vendedores WHERE vendedor_id = $1', [vendedor_id]);
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  delete rows[0].senha;
  return new Vendedor(rows[0]);
}

async function getVendedorPorEmailDB(email) {
  const { rows } = await pool.query('SELECT * FROM tb_vendedores WHERE email = $1', [email]);
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  delete rows[0].senha;
  return new Vendedor(rows[0]);
}

async function addVendedorDB({ nome, email, telefone, data_admissao, senha }) {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const { rows } = await pool.query(
    'INSERT INTO tb_vendedores (nome, email, telefone, data_admissao, senha) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [nome, email, telefone, data_admissao, hashedPassword]
  );
  delete rows[0].senha;
  return new Vendedor(rows[0]);
}

async function updateVendedorDB({ vendedor_id, nome, email, telefone, data_admissao, senha }) {
  let query;
  let values;

  if (senha) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    query = `
      UPDATE tb_vendedores 
      SET nome=$1, email=$2, telefone=$3, data_admissao=$4, senha=$5 
      WHERE vendedor_id=$6 
      RETURNING *
    `;
    values = [nome, email, telefone, data_admissao, hashedPassword, vendedor_id];
  } else {
    query = `
      UPDATE tb_vendedores 
      SET nome=$1, email=$2, telefone=$3, data_admissao=$4 
      WHERE vendedor_id=$5 
      RETURNING *
    `;
    values = [nome, email, telefone, data_admissao, vendedor_id];
  }

  const { rows } = await pool.query(query, values);
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  delete rows[0].senha;
  return new Vendedor(rows[0]);
}


async function deleteVendedorDB(vendedor_id) {
  const { rows } = await pool.query('DELETE FROM tb_vendedores WHERE vendedor_id = $1 RETURNING *', [vendedor_id]);
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  delete rows[0].senha;
  return new Vendedor(rows[0]);
}

module.exports = {
  getVendedoresDB,
  getVendedorPorIdDB,
  getVendedorPorEmailDB,
  addVendedorDB,
  updateVendedorDB,
  deleteVendedorDB
};

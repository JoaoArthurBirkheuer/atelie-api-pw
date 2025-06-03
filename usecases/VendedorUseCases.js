const { pool } = require('../config');
const Vendedor = require('../entities/Vendedor');
const bcrypt = require('bcrypt');

async function getVendedoresDB() {
  const { rows } = await pool.query('SELECT vendedor_id, nome, email, telefone, data_admissao, is_admin FROM tb_vendedores');
  return rows.map(row => {
    return new Vendedor(row);
  });
}

async function getVendedorPorIdDB(vendedor_id) {
  const { rows } = await pool.query('SELECT vendedor_id, nome, email, telefone, data_admissao, is_admin FROM tb_vendedores WHERE vendedor_id = $1', [vendedor_id]);
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  return new Vendedor(rows[0]);
}

async function getVendedorPorEmailDB(email) {
  const { rows } = await pool.query('SELECT vendedor_id, nome, email, telefone, data_admissao, is_admin FROM tb_vendedores WHERE email = $1', [email]);
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  // A senha já é removida
  return new Vendedor(rows[0]);
}

async function addVendedorDB({ nome, email, telefone, data_admissao, senha, is_admin = false }) {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const { rows } = await pool.query(
    'INSERT INTO tb_vendedores (nome, email, telefone, data_admissao, senha, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING vendedor_id, nome, email, telefone, data_admissao, is_admin',
    [nome, email, telefone, data_admissao, hashedPassword, is_admin]
  );
  return new Vendedor(rows[0]);
}

async function updateVendedorDB({ vendedor_id, nome, email, telefone, data_admissao, senha, is_admin }) {
  let query;
  let values;
  let fields = ['nome', 'email', 'telefone', 'data_admissao'];
  let setClauses = fields.map((field, i) => `${field}=$${i + 1}`);
  let paramIndex = fields.length + 1;
  let updateValues = [nome, email, telefone, data_admissao];

  if (senha) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    setClauses.push(`senha=$${paramIndex++}`);
    updateValues.push(hashedPassword);
  }
  
  if (is_admin !== undefined) {
    setClauses.push(`is_admin=$${paramIndex++}`);
    updateValues.push(is_admin);
  }

  query = `
    UPDATE tb_vendedores 
    SET ${setClauses.join(', ')} 
    WHERE vendedor_id=$${paramIndex} 
    RETURNING vendedor_id, nome, email, telefone, data_admissao, is_admin
  `;
  values = [...updateValues, vendedor_id];

  const { rows } = await pool.query(query, values);
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
  return new Vendedor(rows[0]);
}

async function deleteVendedorDB(vendedor_id) {
  const { rows } = await pool.query('DELETE FROM tb_vendedores WHERE vendedor_id = $1 RETURNING vendedor_id, nome, email, telefone, data_admissao, is_admin', [vendedor_id]);
  if (rows.length === 0) throw new Error('Vendedor não encontrado');
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
const { pool } = require('../config');
const Peca = require('../entities/Peca');

async function getPecasDB() {
  const { rows } = await pool.query('SELECT * FROM tb_pecas');
  return rows.map(row => new Peca(row));
}

async function getPecaPorIdDB(id) {
  const { rows } = await pool.query(
    'SELECT * FROM tb_pecas WHERE peca_id = $1',
    [id]
  );
  if (rows.length === 0) throw new Error('Peça não encontrada');
  return new Peca(rows[0]);
}

async function addPecaDB({ nome, descricao, tipo_madeira, largura_cm, altura_cm, profundidade_cm, preco_unitario, estoque }) {
  const { rows } = await pool.query(
    `INSERT INTO tb_pecas 
    (nome, descricao, tipo_madeira, largura_cm, altura_cm, profundidade_cm, preco_unitario, estoque)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [nome, descricao, tipo_madeira, largura_cm, altura_cm, profundidade_cm, preco_unitario, estoque]
  );
  return new Peca(rows[0]);
}

async function updatePecaDB({ peca_id, nome, descricao, tipo_madeira, largura_cm, altura_cm, profundidade_cm, preco_unitario, estoque }) {
  const { rows } = await pool.query(
    `UPDATE tb_pecas SET 
    nome = $1, descricao = $2, tipo_madeira = $3, largura_cm = $4, altura_cm = $5,
    profundidade_cm = $6, preco_unitario = $7, estoque = $8
    WHERE peca_id = $9 RETURNING *`,
    [nome, descricao, tipo_madeira, largura_cm, altura_cm, profundidade_cm, preco_unitario, estoque, peca_id]
  );
  if (rows.length === 0) throw new Error('Peça não encontrada');
  return new Peca(rows[0]);
}

async function deletePecaDB(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM tb_pecas WHERE peca_id = $1',
    [id]
  );
  if (rowCount === 0) throw new Error('Peça não encontrada');
  return 'Peça excluída com sucesso';
}

module.exports = {
  getPecasDB,
  getPecaPorIdDB,
  addPecaDB,
  updatePecaDB,
  deletePecaDB,
};

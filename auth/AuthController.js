const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../config');

async function login(req, res) {
  const { email, senha, tipo } = req.body;

  try {
    if (tipo === 'cliente') {
      const clienteResult = await pool.query('SELECT * FROM tb_clientes WHERE email = $1', [email]);
      if (clienteResult.rows.length === 0) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      const cliente = clienteResult.rows[0];
      const match = await bcrypt.compare(senha, cliente.senha);
      if (!match) return res.status(401).json({ erro: 'Senha inválida' });

      const token = jwt.sign({ id: cliente.cliente_id, tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.json({ token, tipo, id: cliente.cliente_id });
    }

    if (tipo === 'vendedor') {
      const vendedorResult = await pool.query('SELECT * FROM tb_vendedores WHERE email = $1', [email]);
      if (vendedorResult.rows.length === 0) {
        return res.status(404).json({ erro: 'Vendedor não encontrado' });
      }

      const vendedor = vendedorResult.rows[0];
      const match = await bcrypt.compare(senha, vendedor.senha);
      if (!match) return res.status(401).json({ erro: 'Senha inválida' });

      const token = jwt.sign({ id: vendedor.vendedor_id, tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.json({ token, tipo, id: vendedor.vendedor_id });
    }

    return res.status(400).json({ erro: 'Tipo de usuário inválido' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}


async function register(req, res) {
  const { tipo, nome, email, telefone, endereco, data_admissao, senha } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    if (tipo === 'cliente') {
      const result = await pool.query(
        'INSERT INTO tb_clientes (nome, email, telefone, endereco, senha) VALUES ($1, $2, $3, $4, $5) RETURNING cliente_id',
        [nome, email, telefone, endereco, senhaHash]
      );
      const token = jwt.sign({ id: result.rows[0].cliente_id, tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({ token, tipo, id: result.rows[0].cliente_id });
    }

    if (tipo === 'vendedor') {
      const result = await pool.query(
        'INSERT INTO tb_vendedores (nome, email, telefone, data_admissao, senha) VALUES ($1, $2, $3, $4, $5) RETURNING vendedor_id',
        [nome, email, telefone, data_admissao, senhaHash]
      );
      const token = jwt.sign({ id: result.rows[0].vendedor_id, tipo }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({ token, tipo, id: result.rows[0].vendedor_id });
    }

    return res.status(400).json({ erro: 'Tipo de usuário inválido' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { login, register };

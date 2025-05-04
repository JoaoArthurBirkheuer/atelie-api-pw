const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../config');

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    // Verifica se é Cliente
    const clienteResult = await pool.query('SELECT * FROM tb_clientes WHERE email = $1', [email]);
    if (clienteResult.rows.length > 0) {
      const cliente = clienteResult.rows[0];
      const match = await bcrypt.compare(senha, cliente.senha);
      if (!match) return res.status(401).json({ erro: 'Senha inválida' });

      const token = jwt.sign({ id: cliente.cliente_id, tipo: 'cliente' }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.json({ token, tipo: 'cliente', id: cliente.cliente_id });
    }

    // Verifica se é Vendedor
    const vendedorResult = await pool.query('SELECT * FROM tb_vendedores WHERE email = $1', [email]);
    if (vendedorResult.rows.length > 0) {
      const vendedor = vendedorResult.rows[0];
      const match = await bcrypt.compare(senha, vendedor.senha);
      if (!match) return res.status(401).json({ erro: 'Senha inválida' });

      const token = jwt.sign({ id: vendedor.vendedor_id, tipo: 'vendedor' }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });

      return res.json({ token, tipo: 'vendedor', id: vendedor.vendedor_id });
    }

    return res.status(404).json({ erro: 'Usuário não encontrado' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = { login };

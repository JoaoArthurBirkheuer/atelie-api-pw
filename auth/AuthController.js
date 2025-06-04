const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { pool } = require('../config');

async function login(req, res) {
  const { email, senha, tipo } = req.body;

  if (!email || !senha || !tipo) {
    return res.status(400).json({ 
      success: false,
      error: 'Email, senha e tipo são obrigatórios' 
    });
  }

  try {
    let table, idField, redirectRoute;
    
    if (tipo === 'cliente') {
      table = 'tb_clientes';
      idField = 'cliente_id';
      redirectRoute = '/clientes';
    } else if (tipo === 'vendedor') {
      table = 'tb_vendedores';
      idField = 'vendedor_id';
      redirectRoute = '/vendedores';
    } else {
      return res.status(400).json({ 
        success: false,
        error: 'Tipo de usuário inválido' 
      });
    }

    const result = await pool.query(
      `SELECT * FROM ${table} WHERE email = $1`, 
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: `${tipo} não encontrado` 
      });
    }

    const usuario = result.rows[0];
    const match = await bcrypt.compare(senha, usuario.senha);

    if (!match) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciais inválidas' 
      });
    }

    const token = jwt.sign(
      { 
        id: usuario[idField], 
        tipo,
        email: usuario.email,
        is_admin: usuario.is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      success: true,
      token,
      tipo,      
      id: usuario[idField], 
      nome: usuario.nome,
      email: usuario.email,
      is_admin: usuario.is_admin,
      redirect: redirectRoute
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro interno no servidor' 
    });
  }
}

async function register(req, res) {
  const { tipo, nome, email, telefone, endereco, data_admissao, senha, is_admin, jwt_secret } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    if (tipo === 'cliente') {
      const result = await pool.query(
        'INSERT INTO tb_clientes (nome, email, telefone, endereco, senha) VALUES ($1, $2, $3, $4, $5) RETURNING cliente_id',
        [nome, email, telefone, endereco, senhaHash]
      );
      const token = jwt.sign({ id: result.rows[0].cliente_id, tipo, is_admin: false }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({ token, tipo, id: result.rows[0].cliente_id, is_admin: false });
    }

    if (tipo === 'vendedor') {
      let isAdminVendedor = false;

      if (is_admin === true) {
        if (!jwt_secret || jwt_secret !== process.env.JWT_SECRET) {
          return res.status(403).json({ erro: 'Secret JWT inválido para registrar como administrador.' });
        }
        isAdminVendedor = true; 
      }

      const result = await pool.query(
        'INSERT INTO tb_vendedores (nome, email, telefone, data_admissao, senha, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING vendedor_id, is_admin',
        [nome, email, telefone, data_admissao, senhaHash, isAdminVendedor]
      );
      const token = jwt.sign({ id: result.rows[0].vendedor_id, tipo, is_admin: result.rows[0].is_admin }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({ token, tipo, id: result.rows[0].vendedor_id, is_admin: result.rows[0].is_admin });
    }

    return res.status(400).json({ erro: 'Tipo de usuário inválido' });
  } catch (error) {
    console.error('Erro no registro:', error);
    if (error.code === '23505') {
      return res.status(409).json({ erro: 'Email já cadastrado. Por favor, use outro email.' });
    }
    res.status(500).json({ erro: error.message || 'Erro interno no servidor' });
  }
}

module.exports = { login, register };
const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });

    req.usuario = user;
    console.log('Usuário autenticado:', req.usuario);
    next();
  });
}

function verificarCliente(req, res, next) {
  if (req.usuario?.tipo !== 'cliente') {
    return res.status(403).json({ erro: 'Acesso permitido apenas para clientes' });
  }
  next();
}

function verificarVendedor(req, res, next) {
  if (req.usuario?.tipo !== 'vendedor') {
    return res.status(403).json({ erro: 'Acesso permitido apenas para vendedores' });
  }
  next();
}

function verificarAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({ erro: 'Autenticação necessária para esta operação.' });
  }
  if (!req.usuario.is_admin) {
    return res.status(403).json({ erro: 'Acesso permitido apenas para administradores.' });
  }
  next();
}

module.exports = {
  verificarToken,
  verificarCliente,
  verificarVendedor,
  verificarAdmin
};

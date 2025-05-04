const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });

    req.usuario = user;
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

module.exports = {
  verificarToken,
  verificarCliente,
  verificarVendedor
};

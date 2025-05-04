const express = require('express');
const router = express.Router();
const AuthController = require('./AuthController');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

const { verificarToken } = require('./authMiddleware');

router.get('/protegido', verificarToken, (req, res) => {
  res.json({
    mensagem: 'Acesso autorizado!',
    usuario: req.usuario
  });
});

module.exports = router;

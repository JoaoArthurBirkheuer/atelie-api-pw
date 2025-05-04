const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');
const AuthMiddleware = require('../auth/AuthMiddleware');

router.get('/', clienteController.getClientes);
router.get('/:id', clienteController.getClientePorId);
router.post('/', clienteController.addCliente);

// Rotas protegidas (requiram autenticação)
router.put('/:id', AuthMiddleware.verifyToken, clienteController.updateCliente); 
router.delete('/:id', AuthMiddleware.verifyToken, clienteController.deleteCliente);

module.exports = router;

const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');
const { verificarToken, verificarCliente } = require('../auth/AuthMiddleware');

router.get('/', clienteController.getClientes);
router.get('/:id', clienteController.getClientePorId);
router.post('/', clienteController.addCliente);
router.put('/:id', verificarToken, verificarCliente, clienteController.updateCliente);
router.delete('/:id', verificarToken, verificarCliente, clienteController.deleteCliente);

module.exports = router;

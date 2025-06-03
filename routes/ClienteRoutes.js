const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');
const { verificarToken, verificarCliente, verificarAdmin } = require('../auth/AuthMiddleware'); 

router.get('/', clienteController.getClientes);
router.get('/:id', verificarToken, clienteController.getClientePorId); 
router.get('/:id/pedidos', verificarToken, clienteController.getPedidosCliente);
router.post('/', clienteController.addCliente);
router.put('/:id', verificarToken, clienteController.updateCliente);
router.delete('/:id', verificarToken, verificarAdmin, clienteController.deleteCliente); 

module.exports = router;

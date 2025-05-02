const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');

router.get('/', clienteController.getClientes);
router.get('/:id', clienteController.getClientePorId);
router.post('/', clienteController.addCliente);
router.put('/:id', clienteController.updateCliente);
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;
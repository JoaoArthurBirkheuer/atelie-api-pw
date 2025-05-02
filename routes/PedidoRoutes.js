const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/PedidoController');

router.get('/', pedidoController.getPedidos);
router.get('/:id', pedidoController.getPedidoPorId);
router.post('/', pedidoController.addPedido);
router.put('/:id', pedidoController.updatePedido);  // ID na URL
router.delete('/:id', pedidoController.deletePedido);

module.exports = router;
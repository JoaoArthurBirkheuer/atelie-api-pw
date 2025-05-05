const express = require('express');
const router = express.Router();
const itemPedidoController = require('../controllers/ItemPedidoController');

router.get('/', itemPedidoController.getItensPedido);
router.get('/:id', itemPedidoController.getItemPedidoPorId);
router.post('/', itemPedidoController.addItemPedido);
router.put('/:id', itemPedidoController.updateItemPedido);
router.delete('/:id', itemPedidoController.deleteItemPedido);
router.get('/pedido/:pedido_id', itemPedidoController.getItensPorPedido);

module.exports = router;
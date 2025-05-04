const express = require('express');
const router = express.Router();

const clienteRoutes = require('./ClienteRoutes');
const vendedorRoutes = require('./VendedorRoutes');
const pecaRoutes = require('./PecaRoutes');
const pedidoRoutes = require('./PedidoRoutes');
const itemPedidoRoutes = require('./ItemPedidoRoutes');
const authRoutes = require('../auth/AuthRoutes');

router.use('/auth', authRoutes);

router.use('/clientes', clienteRoutes);
router.use('/vendedores', vendedorRoutes);
router.use('/pecas', pecaRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/itens-pedido', itemPedidoRoutes);

module.exports = router;

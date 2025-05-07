const express = require('express');
const router = express.Router();

const clienteRoutes = require('./ClienteRoutes');
const vendedorRoutes = require('./VendedorRoutes');
const pecaRoutes = require('./PecaRoutes');
const pedidoRoutes = require('./PedidoRoutes');
const authRoutes = require('../auth/AuthRoutes');

// Middleware de log global
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas autenticadas
router.use('/clientes', clienteRoutes);
router.use('/vendedores', vendedorRoutes);
router.use('/pecas', pecaRoutes);
router.use('/pedidos', pedidoRoutes);

// Removida a rota específica de itens-pedido pois agora está dentro de pedidos
// router.use('/itens-pedido', itemPedidoRoutes); // ← Esta linha foi removida

module.exports = router;
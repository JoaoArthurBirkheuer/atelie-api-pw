const express = require('express');
const router = express.Router();
const {
  getPedidos,
  getPedidoPorId,
  createPedido,
  updateStatus,
  updatePedido,
  deletePedido,
  getItens,
  addItem
} = require('../controllers/PedidoController');
const { validatePedido } = require('../middlewares/validators');
const { 
  verificarToken, 
  verificarVendedor,
  verificarCliente 
} = require('../auth/AuthMiddleware');

// Middleware de log
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Todas as rotas exigem autenticação
router.use(verificarToken);

// Rotas principais
router.route('/')
  .get(getPedidos)
  .post(verificarCliente, validatePedido, createPedido);

// Rotas específicas por ID
router.route('/:id')
  .get(getPedidoPorId)
  .put(verificarVendedor, validatePedido, updatePedido)
  .delete(verificarVendedor, deletePedido);

// Atualização de status
router.route('/:id/status')
  .put(verificarVendedor, updateStatus);

// Rotas de itens
router.route('/:id/itens')
  .get(getItens)
  .post(verificarVendedor, addItem);

module.exports = router;
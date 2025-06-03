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
  verificarCliente,
  verificarAdmin
} = require('../auth/AuthMiddleware');

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

router.use(verificarToken);

router.route('/')
  .get(getPedidos)
  .post(verificarCliente, validatePedido, createPedido);

router.route('/:id')
  .get(getPedidoPorId)
  .put(verificarVendedor, validatePedido, updatePedido)
  .delete(verificarAdmin, deletePedido);

router.route('/:id/status')
  .put(verificarVendedor, updateStatus);

router.route('/:id/itens')
  .get(getItens)
  .post(verificarAdmin, addItem);

module.exports = router;

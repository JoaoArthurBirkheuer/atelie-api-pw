const express = require('express');
const router = express.Router();
const ItemPedidoController = require('../controllers/ItemPedidoController');
const { verificarToken, verificarVendedor, verificarAdmin } = require('../auth/AuthMiddleware');

const logRequests = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

router.use(logRequests);

router.get('/', 
  verificarToken, 
  verificarVendedor,
  ItemPedidoController.getItensPedido
);

router.get('/:id', 
  verificarToken,
  verificarVendedor,
  ItemPedidoController.getItemPedidoPorId
);

router.post('/', 
  verificarToken,
  verificarVendedor,
  ItemPedidoController.addItemPedido
);

router.put('/:id', 
  verificarToken,
  verificarVendedor,
  ItemPedidoController.updateItemPedido
);

router.delete('/:id', 
  verificarToken,
  verificarAdmin,
  ItemPedidoController.deleteItemPedido
);

module.exports = router;

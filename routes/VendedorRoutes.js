const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/VendedorController');
const AuthMiddleware = require('../auth/AuthMiddleware');

router.get('/', vendedorController.getVendedores);
router.get('/:id', vendedorController.getVendedorPorId);
router.post('/', vendedorController.addVendedor);

router.put('/:id', AuthMiddleware.verifyToken, vendedorController.updateVendedor);
router.delete('/:id', AuthMiddleware.verifyToken, vendedorController.deleteVendedor); 

module.exports = router;

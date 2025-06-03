const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/VendedorController');
const { verificarToken, verificarVendedor, verificarAdmin } = require('../auth/AuthMiddleware');

router.get('/', vendedorController.getVendedores);
router.get('/:id', verificarToken, vendedorController.getVendedorPorId); 
router.post('/', vendedorController.addVendedor);
router.put('/:id', verificarToken, verificarVendedor, vendedorController.updateVendedor);
router.delete('/:id', verificarToken, verificarAdmin, vendedorController.deleteVendedor); 

module.exports = router;

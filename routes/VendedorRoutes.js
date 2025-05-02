const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/VendedorController');

router.get('/', vendedorController.getVendedores);
router.get('/:id', vendedorController.getVendedorPorId);
router.post('/', vendedorController.addVendedor);
router.put('/:id', vendedorController.updateVendedor);
router.delete('/:id', vendedorController.deleteVendedor);

module.exports = router;
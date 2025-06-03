const express = require('express');
const router = express.Router();
const pecaController = require('../controllers/PecaController');
const { verificarToken, verificarVendedor, verificarAdmin } = require('../auth/AuthMiddleware');

router.get('/', pecaController.getPecas);
router.get('/:id', pecaController.getPecaPorId);
router.post('/', verificarToken, verificarVendedor, pecaController.addPeca);
router.put('/:id', verificarToken, verificarVendedor, pecaController.updatePeca);
router.delete('/:id', verificarToken, verificarAdmin, pecaController.deletePeca);

module.exports = router;

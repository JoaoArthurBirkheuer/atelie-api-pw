const express = require('express');
const router = express.Router();
const pecaController = require('../controllers/PecaController');

router.get('/', pecaController.getPecas);
router.get('/:id', pecaController.getPecaPorId);
router.post('/', pecaController.addPeca);
router.put('/', pecaController.updatePeca);
router.delete('/:id', pecaController.deletePeca);

module.exports = router;

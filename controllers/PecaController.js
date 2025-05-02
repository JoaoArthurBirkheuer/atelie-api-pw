const PecaUseCases = require('../usecases/PecaUseCases');

async function getPecas(req, res) {
  try {
    const pecas = await PecaUseCases.getPecasDB();
    res.status(200).json(pecas);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function getPecaPorId(req, res) {
  try {
    const peca = await PecaUseCases.getPecaPorIdDB(req.params.id);
    res.status(200).json(peca);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function addPeca(req, res) {
  try {
    const nova = await PecaUseCases.addPecaDB(req.body);
    res.status(201).json(nova);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function updatePeca(req, res) {
  try {
    const atualizada = await PecaUseCases.updatePecaDB(req.body);
    res.status(200).json(atualizada);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function deletePeca(req, res) {
  try {
    const msg = await PecaUseCases.deletePecaDB(req.params.id);
    res.status(200).json({ mensagem: msg });
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = {
  getPecas,
  getPecaPorId,
  addPeca,
  updatePeca,
  deletePeca,
};

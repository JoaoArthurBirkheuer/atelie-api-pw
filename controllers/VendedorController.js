const VendedorUseCases = require('../usecases/VendedorUseCases');

async function getVendedores(req, res) {
  try {
    const vendedores = await VendedorUseCases.getVendedoresDB();
    res.status(200).json(vendedores);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function getVendedorPorId(req, res) {
  try {
    const vendedor = await VendedorUseCases.getVendedorPorIdDB(req.params.id);
    res.status(200).json(vendedor);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function addVendedor(req, res) {
  try {
    const novo = await VendedorUseCases.addVendedorDB(req.body);
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function updateVendedor(req, res) {
  try {
    const vendedorAtualizado = await VendedorUseCases.updateVendedorDB({
      ...req.body,
      vendedor_id: req.params.id
    });
    res.status(200).json(vendedorAtualizado);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function deleteVendedor(req, res) {
  try {
    const msg = await VendedorUseCases.deleteVendedorDB(req.params.id);
    res.status(200).json({ mensagem: msg });
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = {
  getVendedores,
  getVendedorPorId,
  addVendedor,
  updateVendedor,
  deleteVendedor,
};

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
    if (req.usuario && req.usuario.tipo === 'vendedor' && req.usuario.id !== Number(req.params.id)) {
      return res.status(403).json({ erro: 'Você só pode visualizar seus próprios dados de vendedor.' });
    }
    const vendedor = await VendedorUseCases.getVendedorPorIdDB(req.params.id);
    res.status(200).json(vendedor);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function getVendedorPorEmail(req, res) {
  try {
    const vendedor = await VendedorUseCases.getVendedorPorEmailDB(req.params.email);
    res.status(200).json(vendedor);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function addVendedor(req, res) {
  try {
    const { nome, email, telefone, data_admissao, senha } = req.body;
    const novo = await VendedorUseCases.addVendedorDB({ nome, email, telefone, data_admissao, senha });
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function updateVendedor(req, res) {
  try {
    if (req.usuario.tipo === 'vendedor' && req.usuario.id !== Number(req.params.id)) {
      return res.status(403).json({ erro: 'Você só pode editar sua própria conta de vendedor' }); //
    }
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
  getVendedorPorEmail,
  addVendedor,
  updateVendedor,
  deleteVendedor,
};

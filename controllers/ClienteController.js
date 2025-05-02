const ClienteUseCases = require('../usecases/ClienteUseCases');

async function getClientes(req, res) {
  try {
    const clientes = await ClienteUseCases.getClientesDB();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function getClientePorId(req, res) {
  try {
    const cliente = await ClienteUseCases.getClientePorIdDB(req.params.id);
    res.status(200).json(cliente);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function addCliente(req, res) {
  try {
    const novoCliente = await ClienteUseCases.addClienteDB(req.body);
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function updateCliente(req, res) {
  try {
    const clienteAtualizado = await ClienteUseCases.updateClienteDB(req.body);
    res.status(200).json(clienteAtualizado);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function deleteCliente(req, res) {
  try {
    const msg = await ClienteUseCases.deleteClienteDB(req.params.id);
    res.status(200).json({ mensagem: msg });
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = {
  getClientes,
  getClientePorId,
  addCliente,
  updateCliente,
  deleteCliente,
};

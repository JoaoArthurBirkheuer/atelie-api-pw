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
    if (req.usuario && req.usuario.tipo === 'cliente' && req.usuario.id !== Number(req.params.id)) {
      return res.status(403).json({ erro: 'Você só pode visualizar seus próprios dados de cliente.' });
    }
    const cliente = await ClienteUseCases.getClientePorIdDB(req.params.id);
    res.status(200).json(cliente);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function addCliente(req, res) {
  try {
    const { nome, email, telefone, endereco, senha } = req.body;
    const novoCliente = await ClienteUseCases.addClienteDB({ nome, email, telefone, endereco, senha });
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function updateCliente(req, res) {
  try {
    if (req.usuario.tipo === 'cliente' && req.usuario.id !== Number(req.params.id)) {
      return res.status(403).json({ erro: 'Você só pode editar sua própria conta' });
    }

    const clienteAtualizado = await ClienteUseCases.updateClienteDB({
      ...req.body,
      cliente_id: req.params.id
    });
    res.status(200).json(clienteAtualizado);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function deleteCliente(req, res) {
  try {
    const msg = await ClienteUseCases.deleteClienteDB(req.params.id);
    res.status(200).json({ mensagem: msg });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function getPedidosCliente(req, res) {
  try {
    if (req.usuario.tipo === 'cliente' && req.usuario.id !== Number(req.params.id)) {
      return res.status(403).json({ erro: 'Você só pode visualizar seus próprios pedidos' });
    }

    const pedidos = await ClienteUseCases.getPedidosPorClienteDB(req.params.id);
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

module.exports = {
  getClientes,
  getClientePorId,
  addCliente,
  updateCliente,
  deleteCliente,
  getPedidosCliente
};

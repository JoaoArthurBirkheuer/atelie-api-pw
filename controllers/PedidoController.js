const PedidoUseCases = require('../usecases/PedidoUseCases');

async function getPedidos(req, res) {
  try {
    const pedidos = await PedidoUseCases.getPedidosDB();
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function getPedidoPorId(req, res) {
  try {
    const pedido = await PedidoUseCases.getPedidoPorIdDB(req.params.id);
    res.status(200).json(pedido);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function addPedido(req, res) {
  try {
    const novo = await PedidoUseCases.addPedidoDB(req.body);
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function updatePedido(req, res) {
  try {
    const atualizado = await PedidoUseCases.updatePedidoDB(req.body);
    res.status(200).json(atualizado);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function deletePedido(req, res) {
  try {
    const msg = await PedidoUseCases.deletePedidoDB(req.params.id);
    res.status(200).json({ mensagem: msg });
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = {
  getPedidos,
  getPedidoPorId,
  addPedido,
  updatePedido,
  deletePedido,
};

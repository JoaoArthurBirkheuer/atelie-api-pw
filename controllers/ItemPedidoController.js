const ItemPedidoUseCases = require('../usecases/ItemPedidoUseCases');

async function getItensPedido(req, res) {
  try {
    const itens = await ItemPedidoUseCases.getItensPedidoDB();
    res.status(200).json(itens);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

async function getItemPedidoPorId(req, res) {
  try {
    const item = await ItemPedidoUseCases.getItemPedidoPorIdDB(req.params.id);
    res.status(200).json(item);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function addItemPedido(req, res) {
  try {
    const novo = await ItemPedidoUseCases.addItemPedidoDB(req.body);
    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function updateItemPedido(req, res) {
  try {
    const atualizado = await ItemPedidoUseCases.updateItemPedidoDB(req.body);
    res.status(200).json(atualizado);
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

async function deleteItemPedido(req, res) {
  try {
    const msg = await ItemPedidoUseCases.deleteItemPedidoDB(req.params.id);
    res.status(200).json({ mensagem: msg });
  } catch (error) {
    res.status(404).json({ erro: error.message });
  }
}

module.exports = {
  getItensPedido,
  getItemPedidoPorId,
  addItemPedido,
  updateItemPedido,
  deleteItemPedido,
};

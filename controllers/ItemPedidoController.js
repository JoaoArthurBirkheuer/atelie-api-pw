const ItemPedidoUseCases = require('../usecases/ItemPedidoUseCases');

class ItemPedidoController {
  static async getItensPedido(req, res) {
    try {
      const itens = await ItemPedidoUseCases.getItensPedido();
      res.status(200).json(itens);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async getItemPedidoPorId(req, res) {
    try {
      const item = await ItemPedidoUseCases.getItemPedidoPorId(req.params.id);
      res.status(200).json(item);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  static async addItemPedido(req, res) {
    try {
      const novoItem = await ItemPedidoUseCases.addItemPedido(req.body);
      res.status(201).json(novoItem);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async updateItemPedido(req, res) {
    try {
      const itemAtualizado = await ItemPedidoUseCases.updateItemPedido({
        item_id: req.params.id,
        ...req.body
      });
      res.status(200).json(itemAtualizado);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  static async deleteItemPedido(req, res) {
    try {
      await ItemPedidoUseCases.deleteItemPedido(req.params.id);
      res.status(200).json({ mensagem: 'Item removido com sucesso' });
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  static async getItensPorPedido(req, res) {
    try {
      const itens = await ItemPedidoUseCases.getItensPorPedido(req.params.pedidoId);
      res.status(200).json(itens);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = ItemPedidoController;
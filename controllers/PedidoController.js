const PedidoUseCases = require('../usecases/PedidoUseCases');

class PedidoController {
  static async getPedidos(req, res, next) {
    try {
      const pedidos = await PedidoUseCases.getPedidos();
      res.status(200).json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPedidoPorId(req, res, next) {
    try {
      const pedido = await PedidoUseCases.getPedidoPorId(req.params.id);
      res.status(200).json({
        success: true,
        data: pedido
      });
    } catch (error) {
      next(error);
    }
  }

  static async createPedido(req, res, next) {
    try {
      if (!req.usuario || !req.usuario.id) {
        return res.status(401).json({ success: false, error: 'Usuário não autenticado' });
      }
  
      const pedidoComCliente = {
        ...req.body,
        cliente_id: req.usuario.id
      };
      
      const pedidoCriado = await PedidoUseCases.addPedidoComItens(pedidoComCliente);
      res.status(201).json({
        success: true,
        data: pedidoCriado
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const pedidoAtualizado = await PedidoUseCases.updatePedidoStatus(
        req.params.id,
        req.body.status
      );
      res.status(200).json({
        success: true,
        data: pedidoAtualizado
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePedido(req, res, next) {
    try {
      const pedidoAtualizado = await PedidoUseCases.updatePedidoComItens(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        data: pedidoAtualizado
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePedido(req, res, next) {
    try {
      await PedidoUseCases.deletePedido(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Pedido removido com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getItens(req, res, next) {
    try {
      if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'ID do pedido inválido'
        });
      }

      const itens = await PedidoUseCases.getItensPorPedido(req.params.id);
      res.status(200).json({
        success: true,
        data: itens
      });
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req, res, next) {
    try {
      const item = await PedidoUseCases._addItemPedido({
        ...req.body,
        pedido_id: req.params.id
      });
      res.status(201).json({
        success: true,
        data: item
      });
    } catch (error) {
      next(error);
    }
  }
}

// Exportamos tanto a classe quanto os métodos diretamente
module.exports = {
  PedidoController,
  getPedidos: PedidoController.getPedidos,
  getPedidoPorId: PedidoController.getPedidoPorId,
  createPedido: PedidoController.createPedido,
  updateStatus: PedidoController.updateStatus,
  updatePedido: PedidoController.updatePedido,
  deletePedido: PedidoController.deletePedido,
  getItens: PedidoController.getItens,
  addItem: PedidoController.addItem
};

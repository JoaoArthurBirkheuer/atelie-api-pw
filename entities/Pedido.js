class Pedido {
    constructor({ pedido_id, cliente_id, vendedor_id, data_pedido, status, valor_total, itens = [] }) {
      this.pedido_id = pedido_id;
      this.cliente_id = cliente_id;
      this.vendedor_id = vendedor_id;
      this.data_pedido = data_pedido;
      this.status = status;
      this.valor_total = valor_total;
      this.itens = itens;
    }
  }
  
  module.exports = Pedido;
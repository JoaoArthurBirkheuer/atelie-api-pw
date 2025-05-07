class ItemPedido {
    constructor({ item_id, pedido_id, peca_id, quantidade, preco_venda, desconto_pct, peca_nome }) {
      this.item_id = item_id;
      this.pedido_id = pedido_id;
      this.peca_id = peca_id;
      this.quantidade = quantidade;
      this.preco_venda = preco_venda;
      this.desconto_pct = desconto_pct;
      this.peca_nome = peca_nome;
    }
  }
  
  module.exports = ItemPedido;
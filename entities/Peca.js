class Peca {
    constructor({ peca_id, nome, descricao, tipo_madeira, largura_cm, altura_cm, profundidade_cm, preco_unitario, estoque }) {
      this.peca_id = peca_id;
      this.nome = nome;
      this.descricao = descricao;
      this.tipo_madeira = tipo_madeira;
      this.largura_cm = largura_cm;
      this.altura_cm = altura_cm;
      this.profundidade_cm = profundidade_cm;
      this.preco_unitario = preco_unitario;
      this.estoque = estoque;
    }
  }
  
  module.exports = Peca;
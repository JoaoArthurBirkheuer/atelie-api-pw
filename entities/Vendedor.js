class Vendedor {
    constructor({ vendedor_id, nome, email, telefone, data_admissao }) {
      this.vendedor_id = vendedor_id;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
      this.data_admissao = data_admissao;
    }
  }
  
  module.exports = Vendedor;
class Vendedor {
    constructor({ vendedor_id, nome, email, telefone, data_admissao, senha }) {
      this.vendedor_id = vendedor_id;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
      this.data_admissao = data_admissao;
      this.senha = senha;
    }
  }
  
  module.exports = Vendedor;
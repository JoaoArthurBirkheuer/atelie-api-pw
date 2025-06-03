class Vendedor {
    constructor({ vendedor_id, nome, email, telefone, data_admissao, senha, is_admin }) {
      this.vendedor_id = vendedor_id;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
      this.data_admissao = data_admissao;
      this.senha = senha;
      this.is_admin = is_admin;
    }
  }
  
  module.exports = Vendedor;
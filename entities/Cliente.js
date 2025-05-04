class Cliente {
    constructor({ cliente_id, nome, email, telefone, endereco, senha }) {
      this.cliente_id = cliente_id;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
      this.endereco = endereco;
      this.senha = senha;
    }
  }
  
  module.exports = Cliente;
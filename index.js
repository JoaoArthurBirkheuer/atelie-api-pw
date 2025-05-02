const express = require('express');
const app = express();
const port = 3000;

// Middleware para aceitar JSON
app.use(express.json());

// Importa o roteador principal
const rotas = require('./routes/rotas');
app.use(rotas); // <- Aqui ele registra TODAS as rotas

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para ler JSON
app.use(express.json());

// Serve os arquivos estáticos da pasta 'public'
// Isso já vai servir o index.html na rota '/' automaticamente
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

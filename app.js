// 1. Carregar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const cors = require('cors'); // Importação necessária
const app = express();

// 2. MIDDLEWARES - A ordem aqui é fundamental!
app.use(cors()); // Ativa a permissão para o React acessar a API
app.use(express.json()); // Permite receber dados em JSON
app.use(express.static('public'));

// 3. DEFINIÇÃO DA PORTA
const PORT = process.env.PORT || 3000;

// 4. ROTAS
const produtoRoutes = require('./src/routes/produtoRoutes');
app.use('/produtos', produtoRoutes);

app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API de Produtos com PostgreSQL',
    banco: 'PostgreSQL'
  });
});

// 5. INICIAR SERVIDOR[cite: 1]
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Servidor rodando com CORS habilitado!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
});
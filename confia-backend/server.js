// server.js (VERSÃO FINAL E CORRIGIDA)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const MONGO_URI = 'mongodb+srv://22300147:Sapinho90@confia.tneyira.mongodb.net/?retryWrites=true&w=majority&appName=Confia';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware para servir arquivos estáticos (imagens) da pasta 'uploads'
app.use('/uploads', express.static('uploads'));

// Importar o arquivo de rotas de notícias
const noticiasRoutes = require('./routes/noticias'); 

// --- A LINHA CRÍTICA QUE ESTAVA FALTANDO VAI AQUI ---
// Diz ao Express que todas as requisições que começam com /api/noticias
// devem ser gerenciadas pelo nosso arquivo noticiasRoutes.
app.use('/api/noticias', noticiasRoutes);
// ----------------------------------------------------

// Rota de teste (pode ser removida se não for mais necessária)
app.get('/api', (req, res) => {
    res.json({ message: 'API de teste está no ar!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
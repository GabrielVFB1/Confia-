// server.js 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


const database = require('./config/database'); // Importa o Singleton

// Inicia a conexão usando o Singleton
database.connect();

// Middleware para servir arquivos estáticos (imagens) da pasta 'uploads'
app.use('/uploads', express.static('uploads'));

// Importar o arquivo de rotas de notícias
const noticiasRoutes = require('./routes/noticias');
const feedbackRoutes = require('./routes/feedback'); 

// --- A LINHA CRÍTICA QUE ESTAVA FALTANDO VAI AQUI ---
// Diz ao Express que todas as requisições que começam com /api/noticias
// devem ser gerenciadas pelo nosso arquivo noticiasRoutes.
app.use('/api/noticias', noticiasRoutes);
app.use('/api/feedback', feedbackRoutes);
// ----------------------------------------------------

// Rota de teste (pode ser removida se não for mais necessária)
app.get('/api', (req, res) => {
    res.json({ message: 'API de teste está no ar!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
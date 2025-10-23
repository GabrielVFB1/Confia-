// server.js 
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

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
app.use('/api/auth', authRoutes);
// ----------------------------------------------------

// Rota de teste (pode ser removida se não for mais necessária)
app.get('/api', (req, res) => {
    res.json({ message: 'API de teste está no ar!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
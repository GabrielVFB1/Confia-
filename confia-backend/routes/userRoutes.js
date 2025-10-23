// /routes/userRoutes.js (NOVO ARQUIVO)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Rota pública para ver o perfil de um usuário e suas notícias
// GET /api/users/:id
router.get('/:id', userController.getPerfilUsuario);

module.exports = router;
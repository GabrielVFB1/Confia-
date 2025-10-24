// /routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// Rota para Cadastro (Signup)
router.post('/signup', authController.signup);

// Rota para Login
router.post('/login', authController.login);

// (Opcional) Você pode adicionar uma rota GET /verify para verificar um token depois

module.exports = router;
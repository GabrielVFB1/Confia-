// routes/noticias.js (VERSÃO REFATORADA FINAL)

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 1. Importa o controlador que acabamos de criar
const noticiaController = require('../controllers/noticiaController');

// --- Configuração do Multer (continua aqui pois está relacionado à rota) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const { protect } = require('../middleware/authMiddleware');
// -----------------------------------------------------------------------


router.get('/', noticiaController.buscarTodasAsNoticias);
router.get('/pesquisa', noticiaController.pesquisarNoticias);
router.get('/categoria/:categoriaNome', noticiaController.buscarNoticiasPorCategoria); // Rota de Categoria
router.get('/:id', noticiaController.buscarNoticiaPorId);
router.get('/:id/relacionadas', noticiaController.buscarNoticiasRelacionadas);
router.post('/', protect, upload.single('imagemCapa'), noticiaController.criarNoticia);

module.exports = router;
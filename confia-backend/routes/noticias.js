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
// -----------------------------------------------------------------------


// 2. As rotas agora apenas apontam para as funções do controlador
router.get('/', noticiaController.buscarTodasAsNoticias);
router.get('/pesquisa', noticiaController.pesquisarNoticias)
router.get('/:id', noticiaController.buscarNoticiaPorId);
router.get('/:id/relacionadas', noticiaController.buscarNoticiasRelacionadas);
router.post('/', upload.single('imagemCapa'), noticiaController.criarNoticia);


module.exports = router;
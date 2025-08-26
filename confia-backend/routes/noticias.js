

// routes/noticias.js

// --- Importações Essenciais (NA ORDEM CORRETA) ---
const express = require('express');
const router = express.Router();
const path = require('path'); // 1. O 'path' é importado aqui.
const multer = require('multer');
const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify');

// 2. Agora que 'path' existe, podemos usá-lo para importar o Noticia.
const Noticia = require(path.join(__dirname, '..', 'models', 'Noticia')); 
// ----------------------------------------------------------------

// --- Configuração do Higienizador de HTML (Sanitizer) ---
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// --- Configuração do Multer para Upload de Arquivos ---
// ... (o resto do arquivo continua exatamente o mesmo) ...

// --- Configuração do Multer para Upload de Arquivos ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Salva os arquivos na pasta 'uploads/'
  },
  filename: function (req, file, cb) {
    // Cria um nome de arquivo único para evitar conflitos
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- DEFINIÇÃO DAS ROTAS ---

/**
 * ROTA GET /
 * Busca e retorna todas as notícias, ordenadas da mais recente para a mais antiga.
 */
router.get('/', async (req, res) => {
  try {
    const todasAsNoticias = await Noticia.find().sort({ dataPublicacao: -1 });
    res.json(todasAsNoticias);
  } catch (error) {
    console.error('DETALHES DO ERRO:', error);
    res.status(500).json({ message: "Erro ao buscar notícias" });
  }
});

/**
 * ROTA GET /:id
 * Busca e retorna uma única notícia pelo seu ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id);

    if (!noticia) {
      return res.status(404).json({ message: 'Notícia não encontrada' });
    }

    res.json(noticia);
  } catch (error) {
    console.error('DETALHES DO ERRO:', error);
    res.status(500).json({ message: 'Erro ao buscar notícia' });
  }
});

/**
 * ROTA POST /
 * Cria uma nova notícia. Usa o middleware 'upload' para lidar com a imagem.
 */
router.post('/', upload.single('imagemCapa'), async (req, res) => {
  try {
    const { titulo, categoria, tags, conteudo } = req.body;

    // Transforma a string de tags (ex: "tag1,tag2") em um array
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    // Higieniza o conteúdo HTML recebido do editor
    const conteudoLimpo = purify.sanitize(conteudo);

    const novaNoticia = new Noticia({
      titulo,
      categoria,
      tags: tagsArray,
      conteudo: conteudoLimpo,
      // Se um arquivo foi enviado, salva o caminho dele. Senão, salva null.
      imagemCapa: req.file ? req.file.path : null
    });

    const noticiaSalva = await novaNoticia.save();
    res.status(201).json(noticiaSalva);

  } catch (error) {
    console.error('DETALHES DO ERRO:', error);
    res.status(500).json({ message: 'Erro ao criar notícia', error: error.message });
  }
});

// --- Exportação do Roteador ---
module.exports = router;
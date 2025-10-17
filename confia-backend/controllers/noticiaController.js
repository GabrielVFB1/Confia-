// controllers/noticiaController.js

const noticiaRepository = require('../repositories/NoticiaRepository');
const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Controlador para buscar todas as notícias
exports.buscarTodasAsNoticias = async (req, res) => {
  try {
    const todasAsNoticias = await noticiaRepository.buscarTodos();
    res.json(todasAsNoticias);
  } catch (error) {
    console.error('DETALHES DO ERRO:', error);
    res.status(500).json({ message: "Erro ao buscar notícias" });
  }
};

// Controlador para buscar notícias relacionadas
exports.buscarNoticiasRelacionadas = async (req, res) => {
  try {
    
    const noticiaAtual = await noticiaRepository.buscarPorId(req.params.id);
    if (!noticiaAtual) {
      return res.status(404).json({ message: 'Notícia original não encontrada' });
    }

    
    const noticiasRelacionadas = await noticiaRepository.buscarRelacionadas(noticiaAtual);
    res.json(noticiasRelacionadas);
    
  } catch (error) {
    console.error('DETALHES DO ERRO:', error);
    res.status(500).json({ message: "Erro ao buscar notícias relacionadas" });
  }
};

// Controlador para buscar uma notícia por ID
exports.buscarNoticiaPorId = async (req, res) => {
  try {
    const noticia = await noticiaRepository.buscarPorId(req.params.id);
    if (!noticia) {
      return res.status(404).json({ message: 'Notícia não encontrada' });
    }
    res.json(noticia);
  } catch (error) {
    console.error('DETALHES DO ERRO:', error);
    res.status(500).json({ message: 'Erro ao buscar notícia' });
  }
};

// Controlador para criar uma nova notícia
exports.criarNoticia = async (req, res) => {
  try {
    const { titulo, categoria, tags, conteudo } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const conteudoLimpo = purify.sanitize(conteudo);
     const scoreSimulado = Math.floor(Math.random() * (98 - 65 + 1)) + 65;
    
    const dadosDaNoticia = {
      titulo,
      categoria,
      tags: tagsArray,
      conteudo: conteudoLimpo,
      imagemCapa: req.file ? req.file.path : null
    };

    const noticiaSalva = await noticiaRepository.criar(dadosDaNoticia);
    res.status(201).json(noticiaSalva);
    
  } catch (error) {
    console.error('DETALHES DO ERRO:', error);
    res.status(500).json({ message: 'Erro ao criar notícia', error: error.message });
  }
};

// Controlador para pesquisar notícias
exports.pesquisarNoticias = async (req, res) => {
  try {
    // Pegamos o termo da "query string" da URL (ex: ?q=meu-termo)
    const termoDeBusca = req.query.q;

    if (!termoDeBusca) {
      return res.json([]); // Se não houver termo, retorna uma lista vazia
    }

    const resultados = await noticiaRepository.pesquisar(termoDeBusca);
    res.json(resultados);

  } catch (error) {
    console.error('DETALHES DO ERRO DE BUSCA:', error);
    res.status(500).json({ message: "Erro ao realizar busca" });
  }
};
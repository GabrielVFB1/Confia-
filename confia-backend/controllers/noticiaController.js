// /controllers/noticiaController.js (VERSÃO COMPLETA COM PAGINAÇÃO)

const noticiaRepository = require('../repositories/NoticiaRepository');
const { JSDOM } = require('jsdom');
const DOMPurify = require('dompurify');

// Importa a fábrica para a lógica da IA
const AnalysisStrategyFactory = require('../factories/AnalysisStrategyFactory');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// ===================================================================
// FUNÇÃO 'buscarTodasAsNoticias' (VERSÃO COM PAGINAÇÃO)
// ===================================================================
exports.buscarTodasAsNoticias = async (req, res) => {
  try {
    // Pega os parâmetros 'page' e 'limit' da query string da URL (ex: /api/noticias?page=2&limit=10)
    // Define valores padrão se não forem fornecidos (página 1, 6 itens por página)
    const pagina = req.query.page || 1;
    const limite = req.query.limit || 6; // Ajuste este número se quiser carregar mais/menos por vez

    // Chama o novo método do repositório que implementamos
    const resultadoPaginado = await noticiaRepository.buscarPaginado(pagina, limite);

    // Retorna um objeto JSON contendo as notícias da página atual
    // e informações sobre a paginação total.
    res.json({
      noticias: resultadoPaginado.noticias,
      paginaAtual: parseInt(pagina),       // Número da página que foi retornada
      totalNoticias: resultadoPaginado.total,   // Quantidade total de notícias no banco
      totalPaginas: resultadoPaginado.paginas     // Quantidade total de páginas existentes
    });

  } catch (error) {
    console.error('DETALHES DO ERRO AO BUSCAR NOTÍCIAS PAGINADAS:', error); // Mensagem de erro atualizada
    res.status(500).json({ message: "Erro ao buscar notícias" });
  }
};
// ===================================================================
// FIM DA FUNÇÃO MODIFICADA
// ===================================================================


// Controlador para buscar notícias relacionadas (sem alteração)
exports.buscarNoticiasRelacionadas = async (req, res) => {
    try {
        const noticiaAtual = await noticiaRepository.buscarPorId(req.params.id);
        if (!noticiaAtual) {
            return res.status(404).json({ message: 'Notícia original não encontrada' });
        }
        const noticiasRelacionadas = await noticiaRepository.buscarRelacionadas(noticiaAtual);
        res.json(noticiasRelacionadas);
    } catch (error) {
        console.error('DETALHES DO ERRO AO BUSCAR RELACIONADAS:', error); // Mensagem de erro atualizada
        res.status(500).json({ message: "Erro ao buscar notícias relacionadas" });
    }
};

// Controlador para buscar uma notícia por ID (sem alteração)
exports.buscarNoticiaPorId = async (req, res) => {
    try {
        const noticia = await noticiaRepository.buscarPorId(req.params.id);
        if (!noticia) {
            return res.status(404).json({ message: 'Notícia não encontrada' });
        }
        res.json(noticia);
    } catch (error) {
        console.error('DETALHES DO ERRO AO BUSCAR POR ID:', error); // Mensagem de erro atualizada
        res.status(500).json({ message: 'Erro ao buscar notícia' });
    }
};

// Controlador para criar uma nova notícia (sem alteração)
exports.criarNoticia = async (req, res) => {
    try {
        const { titulo, categoria, tags, conteudo } = req.body;
        
        // 'req.user' agora existe graças ao middleware 'protect'
        // Se a requisição chegou até aqui, req.user está 100% definido.
        
        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
        const conteudoLimpo = purify.sanitize(conteudo);
        
        const analysisStrategy = AnalysisStrategyFactory.getStrategy(categoria);
        const analiseIA = await analysisStrategy.analyze(conteudo);
        
        const dadosDaNoticia = {
            titulo,
            categoria,
            tags: tagsArray,
            conteudo: conteudoLimpo,
            imagemCapa: req.file ? req.file.path : null,
            resumo: analiseIA.resumo,
            taxaConfiabilidade: analiseIA.taxaConfiabilidade,
            revisaoIA: analiseIA.revisao,
            
            // --- CAMPO DE AUTOR ADICIONADO ---
            // Pega o ID do usuário que o middleware 'protect' encontrou
            autor: req.user.id 
            // ---------------------------------
        };

        const noticiaSalva = await noticiaRepository.criar(dadosDaNoticia);
        res.status(201).json(noticiaSalva);
        
    } catch (error) {
        console.error('DETALHES DO ERRO AO CRIAR NOTÍCIA:', error);
        res.status(500).json({ message: 'Erro ao criar notícia', error: error.message });
    }
};
// Controlador para pesquisar notícias (sem alteração)
exports.pesquisarNoticias = async (req, res) => {
    try {
        const termoDeBusca = req.query.q;
        if (!termoDeBusca) {
            return res.json([]); // Retorna array vazio se não houver termo
        }
        const resultados = await noticiaRepository.pesquisar(termoDeBusca);
        res.json(resultados);
    } catch (error) {
        console.error('DETALHES DO ERRO DE BUSCA:', error);
        res.status(500).json({ message: "Erro ao realizar busca" });
    }
};



// /controllers/noticiaController.js (ADICIONAR ESTA FUNÇÃO)

// Controlador para buscar notícias por categoria (COM PAGINAÇÃO)
exports.buscarNoticiasPorCategoria = async (req, res) => {
  try {
    // Pega o nome da categoria do parâmetro da rota (ex: /api/noticias/categoria/politica)
    const categoriaNome = req.params.categoriaNome;
    // Pega os parâmetros de paginação da query string
    const pagina = req.query.page || 1;
    const limite = req.query.limit || 6; // Limite padrão para esta página

    if (!categoriaNome) {
      return res.status(400).json({ message: "Nome da categoria é obrigatório." });
    }

    // Chama o novo método do repositório
    const resultado = await noticiaRepository.buscarPorCategoriaPaginado(categoriaNome, pagina, limite);

    res.json({
      noticias: resultado.noticias,
      paginaAtual: parseInt(pagina),
      totalNoticias: resultado.total,
      totalPaginas: resultado.paginas
    });

  } catch (error) {
    console.error(`ERRO AO BUSCAR NOTÍCIAS DA CATEGORIA ${req.params.categoriaNome}:`, error);
    res.status(500).json({ message: "Erro ao buscar notícias por categoria" });
  }
};

// (O resto das suas funções - buscarTodasAsNoticias, criarNoticia, etc. - continuam aqui)
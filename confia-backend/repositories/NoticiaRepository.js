// /repositories/NoticiaRepository.js (VERSÃO ATUALIZADA COM PAGINAÇÃO)

const Noticia = require('../models/Noticia');

class NoticiaRepository {

  /**
   * Busca todas as notícias no banco de dados, ordenadas pela mais recente.
   * (Este método ainda pode ser útil em outros lugares, então o mantemos)
   * @returns {Promise<Array>} Uma lista de notícias.
   */
  async buscarTodos() {
    return await Noticia.find().sort({ dataPublicacao: -1 });
  }

  // --- NOVO MÉTODO PARA PAGINAÇÃO ---
  /**
   * Busca notícias de forma paginada e retorna o total.
   * @param {number} pagina - O número da página (começando em 1).
   * @param {number} limite - Quantos itens por página.
   * @returns {Promise<{noticias: Array, total: number, paginas: number}>}
   */
  async buscarPaginado(pagina = 1, limite = 6) {
    // Garante que pagina e limite sejam números positivos
    const pageNum = Math.max(1, parseInt(pagina));
    const limitNum = Math.max(1, parseInt(limite));

    // Calcula quantos documentos pular (offset)
    const skip = (pageNum - 1) * limitNum;

    // Busca as notícias paginadas, ordenadas pela mais recente
    const noticias = await Noticia.find()
      .sort({ dataPublicacao: -1 })
      .skip(skip)
      .limit(limitNum);

    // Conta o número total de notícias (sem paginação)
    const total = await Noticia.countDocuments();

    // Calcula o número total de páginas
    const paginas = Math.ceil(total / limitNum);

    return { noticias, total, paginas };
  }
  // --- FIM DO NOVO MÉTODO ---


  /**
   * Busca uma notícia específica pelo seu ID.
   * @param {String} id - O ID da notícia.
   * @returns {Promise<Object|null>} A notícia encontrada ou null.
   */
  async buscarPorId(id) {
    return await Noticia.findById(id).populate('autor', 'nome');
  }

  /**
   * Cria uma nova notícia no banco de dados.
   * @param {Object} dadosDaNoticia - Um objeto com os dados da notícia (titulo, categoria, etc.).
   * @returns {Promise<Object>} A notícia que foi salva.
   */
  async criar(dadosDaNoticia) {
    const novaNoticia = new Noticia(dadosDaNoticia);
    return await novaNoticia.save();
  }

  /**
   * Busca notícias relacionadas com base nas tags.
   * @param {Object} noticiaAtual - O objeto da notícia que está sendo visualizada.
   * @returns {Promise<Array>} Uma lista de até 3 notícias relacionadas.
   */
  async buscarRelacionadas(noticiaAtual) {
    if (!noticiaAtual || !noticiaAtual.tags || noticiaAtual.tags.length === 0) {
      return [];
    }
    return await Noticia.find({
      tags: { $in: noticiaAtual.tags },
      _id: { $ne: noticiaAtual._id }
    }).limit(3).sort({ dataPublicacao: -1 }); // Adicionado sort para mais recentes
  }


  /**
   * Pesquisa por notícias que contenham um termo no título ou no conteúdo.
   * @param {String} termo - O termo a ser pesquisado.
   * @returns {Promise<Array>} Uma lista de notícias encontradas.
   */
  async pesquisar(termo) {
    const regex = new RegExp(termo, 'i');
    return await Noticia.find({
      $or: [
        { titulo: regex },
        { conteudo: regex }
      ]
    }).sort({ dataPublicacao: -1 });
  }



  // /repositories/NoticiaRepository.js (ADICIONAR ESTE MÉTODO)

  /**
   * Busca notícias de uma categoria específica de forma paginada.
   * @param {string} categoriaNome - O nome da categoria a buscar (case-insensitive).
   * @param {number} pagina - O número da página (começando em 1).
   * @param {number} limite - Quantos itens por página.
   * @returns {Promise<{noticias: Array, total: number, paginas: number}>}
   */
  async buscarPorCategoriaPaginado(categoriaNome, pagina = 1, limite = 6) {
    const pageNum = Math.max(1, parseInt(pagina));
    const limitNum = Math.max(1, parseInt(limite));
    const skip = (pageNum - 1) * limitNum;

    // Critério de busca: categoria (case-insensitive)
    const query = { categoria: new RegExp(`^${categoriaNome}$`, 'i') };

    // Busca as notícias paginadas filtradas pela categoria
    const noticias = await Noticia.find(query)
      .sort({ dataPublicacao: -1 })
      .skip(skip)
      .limit(limitNum);

    // Conta o total de notícias NESSA categoria
    const total = await Noticia.countDocuments(query);

    // Calcula o número total de páginas NESSA categoria
    const paginas = Math.ceil(total / limitNum);

    return { noticias, total, paginas };
  }

// (O resto dos seus métodos - buscarTodos, buscarPaginado, etc. - continuam aqui)

  // Você pode adicionar outros métodos aqui se necessário (atualizar, deletar)

}

// Exportamos uma instância da classe (Singleton via cache de módulo)
module.exports = new NoticiaRepository();
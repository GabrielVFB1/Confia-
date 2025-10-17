// repositories/NoticiaRepository.js

const Noticia = require('../models/Noticia');

class NoticiaRepository {

  /**
   * Busca todas as notícias no banco de dados, ordenadas pela mais recente.
   * @returns {Promise<Array>} Uma lista de notícias.
   */
  async buscarTodos() {
    return await Noticia.find().sort({ dataPublicacao: -1 });
  }

  /**
   * Busca uma notícia específica pelo seu ID.
   * @param {String} id - O ID da notícia.
   * @returns {Promise<Object|null>} A notícia encontrada ou null.
   */
  async buscarPorId(id) {
    return await Noticia.findById(id);
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
   * @param {Object} noticiaAtual - O objeto da notícia que está sendo visualizada.
   * @returns {Promise<Array>} Uma lista de até 3 notícias relacionadas.
   */

  async buscarRelacionadas(noticiaAtual) {
    // Se a notícia não tiver tags, retorna uma lista vazia.
    if (!noticiaAtual.tags || noticiaAtual.tags.length === 0) {
      return [];
    }

    // Lógica da busca:
    return await Noticia.find({
      tags: { $in: noticiaAtual.tags },    // Encontra notícias que tenham PELO MENOS UMA das tags da notícia atual.
      _id: { $ne: noticiaAtual._id }       // Garante que a própria notícia atual NÃO apareça na lista.
    }).limit(3);                           // Limita o resultado a no máximo 3 notícias.
  }


  /**
   * Pesquisa por notícias que contenham um termo no título ou no conteúdo.
   * @param {String} termo - O termo a ser pesquisado.
   * @returns {Promise<Array>} Uma lista de notícias encontradas.
   */
  async pesquisar(termo) {
    // Cria uma expressão regular para fazer uma busca "case-insensitive" (não diferencia maiúsculas de minúsculas)
    const regex = new RegExp(termo, 'i');

    // Busca no banco por notícias onde o título OU o conteúdo correspondem ao termo
    return await Noticia.find({
      $or: [
        { titulo: regex },
        { conteudo: regex }
      ]
    }).sort({ dataPublicacao: -1 }); // Ordena os resultados pelos mais recentes
  }
}



  // No futuro, poderíamos adicionar outros métodos aqui, como:
  // async atualizar(id, novosDados) { ... }
  // async deletar(id) { ... }


// Exportamos uma instância da classe, e não a classe em si (Padrão Singleton)
module.exports = new NoticiaRepository();
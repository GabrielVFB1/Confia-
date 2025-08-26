// models/Noticia.js

const mongoose = require('mongoose');

// Schema define a estrutura do documento no banco de dados
const noticiaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  conteudo: {
    type: String,
    required: true
  },
  imagemCapa: {
    type: String,
    required: false
  },
  dataPublicacao: {
    type: Date,
    default: Date.now
  }
});

// Model é a interface que usamos para interagir com a coleção "noticias" no banco
const Noticia = mongoose.model('Noticia', noticiaSchema);

//exporta o modelo para ser usado em outras partes da aplicação
module.exports = Noticia;
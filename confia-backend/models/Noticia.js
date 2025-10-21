const mongoose = require('mongoose');

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
  },


  taxaConfiabilidade: { // Renomeado de 'scoreConfiabilidade'
    type: Number,
    min: 0,
    max: 100,
    default: 50 // Um valor padrão neutro
  },
  resumo: {
    type: String,
    required: false,
    default: ""
  },
  revisaoIA: {
    type: String,
    required: false,
    default: ""
  }

});

const Noticia = mongoose.model('Noticia', noticiaSchema);

module.exports = Noticia;
// /models/Noticia.js
const mongoose = require('mongoose');

const noticiaSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    categoria: { type: String, required: true },
    tags: { type: [String], default: [] },
    conteudo: { type: String, required: true },
    imagemCapa: { type: String, required: false },
    dataPublicacao: { type: Date, default: Date.now },
    taxaConfiabilidade: { type: Number, min: 0, max: 100, default: 50 },
    resumo: { type: String, default: "" },
    revisaoIA: { type: String, default: "" },

    // --- NOVA LINHA ADICIONADA ---
    // Armazena o ID do usuário que criou a notícia
    // 'ref: 'User'' diz ao Mongoose para ligar este campo à coleção 'User'
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // O nome do Model que criamos (User.js)
        required: true // Garante que toda notícia tenha um autor
    }
    // --- FIM DA NOVA LINHA ---
});

const Noticia = mongoose.model('Noticia', noticiaSchema);
module.exports = Noticia;
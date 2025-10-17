// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  artigoAvaliado: {
    type: String,
    required: false // Opcional
  },
  avaliacao: {
    type: String,
    required: true
  },
  comentario: {
    type: String,
    required: true
  },
  dataEnvio: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
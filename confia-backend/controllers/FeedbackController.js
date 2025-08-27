// controllers/feedbackController.js
const feedbackRepository = require('../repositories/FeedbackRepository');

exports.criarFeedback = async (req, res) => {
  try {
    const dadosDoFeedback = {
      artigoAvaliado: req.body.artigoAvaliado,
      avaliacao: req.body.avaliacao,
      comentario: req.body.comentario
    };
    
    const feedbackSalvo = await feedbackRepository.criar(dadosDoFeedback);
    res.status(201).json(feedbackSalvo);

  } catch (error) {
    console.error('ERRO AO CRIAR FEEDBACK:', error);
    res.status(500).json({ message: 'Erro ao salvar feedback.' });
  }
};
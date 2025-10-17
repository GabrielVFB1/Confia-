// repositories/FeedbackRepository.js
const Feedback = require('../models/Feedback');

class FeedbackRepository {
  async criar(dadosDoFeedback) {
    const novoFeedback = new Feedback(dadosDoFeedback);
    return await novoFeedback.save();
  }
}

module.exports = new FeedbackRepository();
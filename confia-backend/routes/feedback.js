// routes/feedback.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/FeedbackController');

// Rota para POST /api/feedback/
router.post('/', feedbackController.criarFeedback);

module.exports = router;
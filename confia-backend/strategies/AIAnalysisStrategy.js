// /strategies/AIAnalysisStrategy.js (CÓDIGO LIMPO)
const AnalysisStrategy = require('./AnalysisStrategy');
const analysisService = require('../services/analysisService');

class AIAnalysisStrategy extends AnalysisStrategy {
    async analyze(conteudo) {
        console.log("LOG: Usando Estratégia de IA (Gemini) para análise...");
        return await analysisService.analyzeNews(conteudo);
    }
}
module.exports = AIAnalysisStrategy;
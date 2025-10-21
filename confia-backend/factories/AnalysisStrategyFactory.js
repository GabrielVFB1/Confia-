// /factories/AnalysisStrategyFactory.js (CÓDIGO LIMPO)
const AIAnalysisStrategy = require('../strategies/AIAnalysisStrategy');
const SimpleAnalysisStrategy = require('../strategies/SimpleAnalysisStrategy');

const aiStrategy = new AIAnalysisStrategy();
const simpleStrategy = new SimpleAnalysisStrategy();

class AnalysisStrategyFactory {
    static getStrategy(categoria) {
        const categoriaNorm = (categoria || "").toLowerCase();
        if (categoriaNorm === 'politica') {
            return aiStrategy;
        }
        return simpleStrategy;
    }
}
module.exports = AnalysisStrategyFactory;
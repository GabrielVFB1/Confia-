// /strategies/SimpleAnalysisStrategy.js (CÓDIGO LIMPO)
const AnalysisStrategy = require('./AnalysisStrategy');

class SimpleAnalysisStrategy extends AnalysisStrategy {
    async analyze(conteudo) {
        console.log("LOG: Usando Estratégia Simples (Simulada)...");
        const scoreSimulado = Math.floor(Math.random() * (98 - 65 + 1)) + 65;
        return {
            resumo: "Resumo automático não aplicado para esta categoria.",
            taxaConfiabilidade: scoreSimulado,
            revisao: "Análise de IA não executada."
        };
    }
}
module.exports = SimpleAnalysisStrategy;
// /strategies/AnalysisStrategy.js (CÓDIGO LIMPO)
class AnalysisStrategy {
    async analyze(conteudo) {
        throw new Error("O método 'analyze' deve ser implementado pela subclasse.");
    }
}
module.exports = AnalysisStrategy;
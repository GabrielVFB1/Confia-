// /services/analysisService.js (VERSÃO FINAL LIMPA)
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY; 

class AnalysisService {

    constructor(apiKey) {
        if (!apiKey) {
            console.warn("************************************************************");
            console.warn("AVISO: GEMINI_API_KEY não definida no arquivo .env.");
            console.warn("A análise de IA usará valores simulados.");
            console.warn("************************************************************");
            this.model = null;
        } else {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                
                // --- CORREÇÃO FINAL ---
                // Usando o nome do modelo que APARECEU na sua lista de DEBUG
                this.model = genAI.getGenerativeModel({ model: "gemini-pro-latest" }); 
                // ----------------------

                console.log("Serviço de Análise de IA (Gemini) inicializado (modelo: gemini-pro-latest).");

            } catch (error) {
                console.error("Erro ao inicializar o modelo Gemini:", error.message);
                this.model = null;
            }
        }
    }

    _stripHtml(html) {
        if (!html) return "";
        return html.replace(/<[^>]+>/g, '');
    }

    async analyzeNews(rawContent) {
        if (!this.model) {
            return this._getMockAnalysis();
        }

        const newsText = this._stripHtml(rawContent);
        
        // Prompt "à prova de balas"
// Prompt "à prova de balas"
        const prompt = 'Você é um editor-chefe e um verificador de fatos (fact-checker) rigoroso do portal "Confia!". Sua função é analisar um artigo e fornecer uma análise crítica da sua confiabilidade.' +
          ' Analise o seguinte texto: ' +
          '"""' +
          newsText.substring(0, 3800) +
          '"""' +
          ' Responda APENAS com um objeto JSON válido (sem markdown \'json\', \'```\', ou qualquer outro texto). O JSON deve ter as chaves:' +
          
          ' 1. "resumo": Um resumo conciso do artigo em 2-3 frases.' +
          
          ' 2. "taxaConfiabilidade": Um número de 0 a 100 sobre a confiabilidade. Sua pontuação deve ser baseada em:' +
          ' - Coerência e lógica interna.' +
          ' - Tom (se é opinativo ou factual).' +
          ' - Alegações: Se o texto faz alegações fortes (números, fatos, citações) e se ele *mesmo* apresenta fontes ou evidências para elas.' +
          
          ' 3. "revisaoIA": Uma análise (2-3 frases) justificando a pontuação. Aponte especificamente quais alegações no texto carecem de fontes ou parecem enviesadas. (Ex: \'O artigo afirma que "X aumentou 50%", mas não cita a fonte desse dado. O tom é parcial.\')';

        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            let text = response.text();
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const analysis = JSON.parse(text);
            return analysis;

        } catch (error) {
            console.error("Erro ao analisar notícia com IA:", error);
            return this._getMockAnalysis("Falha na análise da IA.");
        }
    }

    _getMockAnalysis(revisao = "Análise de IA não disponível.") {
        const scoreSimulado = Math.floor(Math.random() * (90 - 60 + 1)) + 60;
        return {
            resumo: "Resumo indisponível no momento.",
            taxaConfiabilidade: scoreSimulado,
            revisao: revisao
        };
    }
}

const analysisServiceInstance = new AnalysisService(API_KEY);
module.exports = analysisServiceInstance;
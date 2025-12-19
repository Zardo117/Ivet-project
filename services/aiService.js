// services/aiService.js
// Serviço de IA usando Google Gemini

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar o cliente Gemini
let genAI = null;
let availableModel = 'gemini-1.5-flash-latest'; // Modelo padrão

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Tentar detectar modelo disponível
  (async () => {
    try {
      // Lista de modelos para tentar
      const modelsToTry = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-2.0-flash-exp'
      ];
      
      // Tentar o primeiro modelo (vai falhar se não existir, mas vamos tentar quando necessário)
      availableModel = modelsToTry[0];
      console.log(`Usando modelo: ${availableModel}`);
    } catch (error) {
      console.error('Erro ao detectar modelo:', error);
    }
  })();
}

class AIService {
  /**
   * Tenta gerar conteúdo com um modelo, tentando outros se falhar
   */
  static async generateWithFallback(prompt) {
    const modelsToTry = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro',
      'gemini-pro'
    ];

    let lastError = null;
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log(`✅ Modelo funcionando: ${modelName}`);
        return response.text();
      } catch (error) {
        console.log(`❌ Modelo ${modelName} não disponível, tentando próximo...`);
        lastError = error;
        continue;
      }
    }
    
    throw new Error(`Nenhum modelo disponível. Último erro: ${lastError?.message || 'Desconhecido'}`);
  }

  /**
   * Gera uma análise clínica completa baseada nos sintomas
   */
  static async analyzeClinicalCase(species, breed, age, symptoms, history = '') {
    if (!genAI) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    try {
      const prompt = `
Você é um Especialista em Medicina Veterinária Sênior com anos de experiência.
Analise o seguinte caso clínico e forneça uma análise completa e profissional.

INSTRUÇÕES:
1. Liste diagnósticos diferenciais prováveis com estimativas de probabilidade
2. Sugira exames complementares relevantes
3. Proponha um plano de tratamento inicial
4. Indique sinais de alerta que requerem atenção imediata
5. Seja específico, técnico, mas claro

DADOS DO PACIENTE:
- Espécie: ${species}
- Raça: ${breed || 'Não informada'}
- Idade: ${age} anos

SINTOMAS ATUAIS:
${symptoms}

HISTÓRICO MÉDICO:
${history || 'Não informado'}

Formate a resposta em Markdown claro e profissional, usando:
- Títulos (##) para seções
- Listas para diagnósticos e recomendações
- Destaque para informações críticas

IMPORTANTE: Sempre enfatize que esta é uma análise preliminar e que a decisão final deve ser do Médico Veterinário responsável.
      `;

      return await this.generateWithFallback(prompt);
    } catch (error) {
      console.error('Erro ao chamar Gemini API:', error);
      throw new Error(`Erro ao processar análise clínica: ${error.message}`);
    }
  }

  /**
   * Chat com assistente veterinário
   */
  static async chat(message, conversationHistory = []) {
    if (!genAI) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    try {
      // Construir contexto da conversa
      const historyContext = conversationHistory
        .slice(-6) // Últimas 6 mensagens para contexto
        .map((msg, idx) => {
          const isUser = idx % 2 === 0;
          return isUser ? `Usuário: ${msg}` : `Assistente: ${msg}`;
        })
        .join('\n');

      const prompt = `
Você é o I-Vet Assistant, um assistente virtual especializado em medicina veterinária.
Sua função é ajudar veterinários e tutores com:
- Dúvidas sobre farmacologia
- Orientações sobre triagem
- Informações sobre procedimentos
- Suporte clínico geral

DIRETRIZES:
- Seja conciso, profissional e técnico
- Baseie suas respostas em conhecimentos veterinários sólidos
- Se não tiver certeza, indique a necessidade de consulta presencial
- Para questões graves ou emergenciais, sempre recomende busca imediata de atendimento

${historyContext ? `\nHistórico da conversa:\n${historyContext}\n` : ''}

Nova pergunta do usuário:
${message}

Responda de forma clara e objetiva:
      `;

      return await this.generateWithFallback(prompt);
    } catch (error) {
      console.error('Erro ao chamar Gemini API para chat:', error);
      throw new Error(`Erro ao processar pergunta: ${error.message}`);
    }
  }

  /**
   * Gera diagnóstico baseado em sintomas (mantido para compatibilidade)
   */
  static async diagnose(symptoms, species = null, breed = null) {
    const analysis = await this.analyzeClinicalCase(
      species || 'Canino',
      breed || '',
      0,
      symptoms
    );

    return {
      possibleDiagnosis: ['Análise completa gerada'],
      recommendations: 'Ver análise completa para recomendações detalhadas',
      confidence: 0.8,
      note: analysis
    };
  }
}

module.exports = AIService;

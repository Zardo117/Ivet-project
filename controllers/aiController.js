// controllers/aiController.js

const AIService = require('../services/aiService');

exports.analyzeClinicalCase = async (req, res) => {
  try {
    const { species, breed, age, symptoms, history } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Sintomas são obrigatórios' });
    }

    const analysis = await AIService.analyzeClinicalCase(
      species || 'Canino',
      breed || '',
      age || 0,
      symptoms,
      history || ''
    );

    res.json({ analysis });
  } catch (error) {
    console.error('Erro ao analisar caso clínico:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao processar análise clínica',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    const response = await AIService.chat(message.trim(), conversationHistory);

    res.json({ response });
  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(500).json({ 
      error: error.message || 'Erro ao processar pergunta',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// controllers/diagnosisController.js

const AIService = require('../services/aiService');

/**
 * Obtém diagnóstico baseado em sintomas
 * Usa serviço mock de IA (MVP) - pode ser substituído por serviço real
 */
exports.getDiagnosis = async (req, res) => {
  try {
    const { symptoms, species, breed } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Sintomas são obrigatórios' });
    }

    // Usa serviço mock de IA (em produção, substituir por chamada real)
    const diagnosis = await AIService.diagnose(symptoms, species, breed);

    res.json(diagnosis);
  } catch (error) {
    console.error('Erro ao obter diagnóstico:', error);
    res.status(500).json({ error: 'Erro ao gerar diagnóstico' });
  }
};


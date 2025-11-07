// controllers/appointmentController.js

const Appointment = require('../models/Appointment');
const Pet = require('../models/Pet');
const Diagnosis = require('../models/Diagnosis');
const AIService = require('../services/aiService');

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.json(appointment);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
};

exports.createAppointmentWithDiagnosis = async (req, res) => {
  try {
    const { petId, vetId, date, symptoms } = req.body;

    // Cria o agendamento
    const appointment = await Appointment.create({ 
      petId, 
      vetId, 
      date, 
      status: 'scheduled' 
    });

    // Obtém diagnóstico baseado nos sintomas e informações do pet
    let diagnosis = null;

    if (symptoms) {
      try {
        // Busca informações do pet para enviar ao serviço de IA
        const pet = await Pet.findByPk(petId);

        // Usa serviço mock de IA (em produção, substituir por chamada real)
        const diagnosisData = await AIService.diagnose(
          symptoms,
          pet?.species || null,
          pet?.breed || null
        );

        // Salva o diagnóstico no banco de dados
        diagnosis = await Diagnosis.create({
          appointmentId: appointment.id,
          possibleDiagnosis: diagnosisData.possibleDiagnosis || [],
          recommendations: diagnosisData.recommendations || null,
          symptoms,
          species: pet?.species || null,
          breed: pet?.breed || null
        });
      } catch (error) {
        console.error('Erro ao obter diagnóstico:', error.message);
        // Continua mesmo se houver erro no diagnóstico
      }
    }

    res.json({ appointment, diagnosis });
  } catch (error) {
    console.error('Erro ao criar agendamento com diagnóstico:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
};


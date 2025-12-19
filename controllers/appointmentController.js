// controllers/appointmentController.js

const Appointment = require('../models/Appointment');
const Pet = require('../models/Pet');
const User = require('../models/User');
const Diagnosis = require('../models/Diagnosis');
const AIService = require('../services/aiService');

exports.getAllAppointments = async (req, res) => {
  try {
    const whereClause = {};
    
    // Se for tutor, só vê agendamentos dos seus pets
    if (req.user.role === 'tutor') {
      // Buscar pets do tutor
      const pets = await Pet.findAll({ where: { ownerId: req.user.id } });
      const petIds = pets.map(p => p.id);
      if (petIds.length === 0) {
        return res.json([]);
      }
      whereClause.petId = petIds;
    } else if (req.user.role === 'vet') {
      // Veterinário vê seus próprios agendamentos
      whereClause.vetId = req.user.id;
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: User,
          as: 'vet',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['date', 'ASC']]
    });

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: User,
          as: 'vet',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { date, petId, type } = req.body;

    console.log('Recebendo dados de agendamento:', { date, petId, type });

    if (!date || !petId) {
      return res.status(400).json({ error: 'Data e ID do pet são obrigatórios' });
    }

    // Validar e converter data
    let appointmentDate;
    if (typeof date === 'string') {
      appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        console.error('Data inválida recebida:', date);
        return res.status(400).json({ error: 'Data inválida. Formato esperado: YYYY-MM-DDTHH:MM:SS' });
      }
    } else {
      appointmentDate = date;
    }

    console.log('Data convertida:', appointmentDate);

    // Se o usuário logado for um tutor, só pode criar agendamentos para seus próprios pets
    // Se for vet/admin, pode criar para qualquer pet
    const vetId = req.user.role === 'tutor' ? null : (req.body.vetId || req.user.id);
    
    // Verificar se o pet existe e se pertence ao tutor (se for tutor)
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado' });
    }

    if (req.user.role === 'tutor' && pet.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Você só pode agendar para seus próprios pets' });
    }

    // Converter status do frontend para o formato do banco
    const statusMap = {
      'Agendado': 'scheduled',
      'Concluido': 'completed',
      'Cancelado': 'canceled'
    };
    
    const appointment = await Appointment.create({
      date: appointmentDate,
      petId: Number(petId),
      vetId: vetId ? Number(vetId) : null,
      status: statusMap[req.body.status] || 'scheduled',
      type: type || null
    });

    // Buscar o agendamento com relacionamentos
    const appointmentWithRelations = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: User,
          as: 'vet',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json(appointmentWithRelations);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ 
      error: 'Erro ao criar agendamento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const { status, date } = req.body;

    // Converter status do frontend para o formato do banco
    const statusMap = {
      'Agendado': 'scheduled',
      'Concluido': 'completed',
      'Cancelado': 'canceled'
    };

    if (status && statusMap[status]) {
      appointment.status = statusMap[status];
    }

    if (date) {
      appointment.date = new Date(date);
    }

    await appointment.save();

    // Buscar com relacionamentos
    const updatedAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Pet,
          as: 'pet',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email', 'phone']
          }]
        },
        {
          model: User,
          as: 'vet',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    await appointment.destroy();
    res.json({ message: 'Agendamento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ error: 'Erro ao deletar agendamento' });
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

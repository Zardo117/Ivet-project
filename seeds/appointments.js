// seeds/appointments.js

const Appointment = require('../models/Appointment');



async function seedAppointments() {

  try {

    await Appointment.create({

      petId: 123,

      vetId: 45,

      date: new Date('2025-11-10T14:00:00'),

      status: 'scheduled'

    });

    console.log('Agendamento criado com sucesso');

  } catch (error) {

    console.error('Erro ao criar agendamento:', error);

  }

}



module.exports = seedAppointments;






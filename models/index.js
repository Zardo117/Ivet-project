// models/index.js
// Arquivo para definir relacionamentos entre os models

const User = require('./User');
const Pet = require('./Pet');
const Appointment = require('./Appointment');
const Diagnosis = require('./Diagnosis');

// Relacionamentos

// User -> Pet (1:N) - Um usuário pode ter vários pets
User.hasMany(Pet, {
  foreignKey: 'ownerId',
  as: 'pets'
});

Pet.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner'
});

// User -> Appointment (1:N) - Um veterinário pode ter vários agendamentos
User.hasMany(Appointment, {
  foreignKey: 'vetId',
  as: 'appointments'
});

Appointment.belongsTo(User, {
  foreignKey: 'vetId',
  as: 'vet'
});

// Pet -> Appointment (1:N) - Um pet pode ter vários agendamentos
Pet.hasMany(Appointment, {
  foreignKey: 'petId',
  as: 'appointments'
});

Appointment.belongsTo(Pet, {
  foreignKey: 'petId',
  as: 'pet'
});

// Appointment -> Diagnosis (1:1) - Um agendamento pode ter um diagnóstico
Appointment.hasOne(Diagnosis, {
  foreignKey: 'appointmentId',
  as: 'diagnosis'
});

Diagnosis.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment'
});

module.exports = {
  User,
  Pet,
  Appointment,
  Diagnosis
};


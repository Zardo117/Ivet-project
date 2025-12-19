// models/Appointment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  vetId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  petId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Pets',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'canceled'),
    allowNull: false,
    defaultValue: 'scheduled'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Appointments',
  timestamps: true
});

module.exports = Appointment;

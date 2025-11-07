// models/Appointment.js

const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');



const Appointment = sequelize.define('Appointment', {

  date: DataTypes.DATE,

  vetId: DataTypes.INTEGER,

  petId: DataTypes.INTEGER,

  status: DataTypes.ENUM('scheduled', 'completed', 'canceled')

});



module.exports = Appointment;




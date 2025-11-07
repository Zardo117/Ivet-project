// models/Diagnosis.js

const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');



const Diagnosis = sequelize.define('Diagnosis', {

  appointmentId: DataTypes.INTEGER,

  possibleDiagnosis: DataTypes.JSON, // Array de diagnósticos possíveis

  recommendations: DataTypes.TEXT,

  symptoms: DataTypes.TEXT,

  species: DataTypes.STRING,

  breed: DataTypes.STRING

});



module.exports = Diagnosis;




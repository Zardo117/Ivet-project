// models/User.js

const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');



const User = sequelize.define('User', {

  name: DataTypes.STRING,

  email: { type: DataTypes.STRING, unique: true },

  password: DataTypes.STRING,

  phone: DataTypes.STRING,

  role: DataTypes.ENUM('vet', 'admin', 'tutor')

});



module.exports = User;


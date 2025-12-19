// models/User.js

const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('vet', 'admin', 'tutor'),
    allowNull: false,
    defaultValue: 'tutor'
  }
}, {
  tableName: 'Users',
  timestamps: true
});



module.exports = User;


// models/Pet.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pet = sequelize.define('Pet', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false
  },
  breed: DataTypes.STRING,
  age: DataTypes.INTEGER,
  weight: DataTypes.DECIMAL(5, 2),
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  imageUrl: DataTypes.STRING
});

module.exports = Pet;

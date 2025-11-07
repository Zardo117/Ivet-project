// models/Pet.js

const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');



const Pet = sequelize.define('Pet', {

  name: DataTypes.STRING,

  species: DataTypes.STRING,

  breed: DataTypes.STRING,

  age: DataTypes.INTEGER,

  ownerId: DataTypes.INTEGER

});



module.exports = Pet;




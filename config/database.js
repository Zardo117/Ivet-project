// config/database.js
// Configuração do Sequelize CLI para migrations e seeds

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'softpet_user',
    password: process.env.DB_PASSWORD || 'softpet_password',
    database: process.env.DB_NAME || 'softpet',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.DB_USER || 'softpet_user',
    password: process.env.DB_PASSWORD || 'softpet_password',
    database: process.env.DB_NAME_TEST || 'softpet_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
};


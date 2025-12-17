// config/database.js
// Configuração do Sequelize CLI para migrations e seeds

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('DB Config Loaded:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

module.exports = {
  development: {
    username: process.env.DB_USER || 'softpet_user',
    password: process.env.DB_PASSWORD || 'softpet_password',
    database: process.env.DB_NAME || 'softpet',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
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
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};

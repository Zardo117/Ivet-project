'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('senha123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'João Silva',
        email: 'joao@example.com',
        password: hashedPassword,
        phone: '+5511999999999',
        role: 'tutor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Maria Santos',
        email: 'maria@example.com',
        password: hashedPassword,
        phone: '+5511888888888',
        role: 'tutor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dr. Carlos Oliveira',
        email: 'carlos@example.com',
        password: hashedPassword,
        phone: '+5511777777777',
        role: 'vet',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dra. Ana Costa',
        email: 'ana@example.com',
        password: hashedPassword,
        phone: '+5511666666666',
        role: 'vet',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin Sistema',
        email: 'admin@softpet.com',
        password: hashedPassword,
        phone: '+5511555555555',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};


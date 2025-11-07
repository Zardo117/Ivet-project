'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 30, 0, 0);

    await queryInterface.bulkInsert('Appointments', [
      {
        date: tomorrow,
        vetId: 3, // Dr. Carlos Oliveira
        petId: 1, // Rex
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: nextWeek,
        vetId: 4, // Dra. Ana Costa
        petId: 2, // Mimi
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: new Date('2024-12-20T09:00:00Z'),
        vetId: 3, // Dr. Carlos Oliveira
        petId: 3, // Thor
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Appointments', null, {});
  }
};


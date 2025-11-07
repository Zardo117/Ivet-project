'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Pets', [
      {
        name: 'Rex',
        species: 'cão',
        breed: 'Labrador',
        age: 3,
        ownerId: 1, // João Silva
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mimi',
        species: 'gato',
        breed: 'Persa',
        age: 2,
        ownerId: 1, // João Silva
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Thor',
        species: 'cão',
        breed: 'Golden Retriever',
        age: 5,
        ownerId: 2, // Maria Santos
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Luna',
        species: 'gato',
        breed: 'Siamês',
        age: 1,
        ownerId: 2, // Maria Santos
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bolinha',
        species: 'cão',
        breed: 'Bulldog',
        age: 4,
        ownerId: 1, // João Silva
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Pets', null, {});
  }
};


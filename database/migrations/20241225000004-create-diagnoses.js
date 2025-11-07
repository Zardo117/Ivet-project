'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Diagnoses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Appointments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      possibleDiagnosis: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array de diagnósticos possíveis'
      },
      recommendations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      symptoms: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      species: {
        type: Sequelize.STRING,
        allowNull: true
      },
      breed: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adiciona índice para melhorar performance
    await queryInterface.addIndex('Diagnoses', ['appointmentId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Diagnoses');
  }
};


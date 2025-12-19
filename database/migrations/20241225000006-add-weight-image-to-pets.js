'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicionar colunas que faltam caso a tabela já exista
    const tableInfo = await queryInterface.describeTable('Pets');
    
    if (!tableInfo.weight) {
      await queryInterface.addColumn('Pets', 'weight', {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      });
    }

    if (!tableInfo.imageUrl) {
      await queryInterface.addColumn('Pets', 'imageUrl', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Pets', 'weight');
    await queryInterface.removeColumn('Pets', 'imageUrl');
  }
};




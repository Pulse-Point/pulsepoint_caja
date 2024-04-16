'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contratos', 'clienteId');
    await queryInterface.addColumn('Contratos', 'clienteDni', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contratos', 'clienteDni');
    await queryInterface.addColumn('Contratos', 'clienteId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
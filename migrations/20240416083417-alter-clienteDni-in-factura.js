'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Facturas', 'clienteId');
    await queryInterface.addColumn('Facturas', 'clienteDni', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Facturas', 'clienteDni');
    await queryInterface.addColumn('Facturas', 'clienteId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
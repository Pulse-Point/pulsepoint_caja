'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contratos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contratoId: {
        type: Sequelize.INTEGER
      },
      clienteId: {
        type: Sequelize.INTEGER
      },
      servicioCod: {
        type: Sequelize.STRING
      },
      contratoDescripcion: {
        type: Sequelize.STRING
      },
      servicioPrecio: {
        type: Sequelize.DECIMAL
      },
      contratoFechaInicio: {
        type: Sequelize.DATE
      },
      contratoFechaVencimiento: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Contratos');
  }
};
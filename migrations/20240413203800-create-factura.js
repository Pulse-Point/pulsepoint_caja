'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Facturas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facturaCod: {
        type: Sequelize.STRING
      },
      clienteId: {
        type: Sequelize.INTEGER
      },
      sucursalId: {
        type: Sequelize.INTEGER
      },
      facturaDetalle: {
        type: Sequelize.STRING
      },
      facturaDescripcion: {
        type: Sequelize.STRING
      },
      facturaMetodoPago: {
        type: Sequelize.STRING
      },
      facturaItbis: {
        type: Sequelize.DECIMAL
      },
      facturaSubtotal: {
        type: Sequelize.DECIMAL
      },
      facturaTotal: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('Facturas');
  }
};
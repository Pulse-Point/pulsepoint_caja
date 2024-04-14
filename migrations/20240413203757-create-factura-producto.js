'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FacturaProductos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facturaProductoId: {
        type: Sequelize.INTEGER
      },
      productoCod: {
        type: Sequelize.STRING
      },
      facturaCod: {
        type: Sequelize.STRING
      },
      facturaProductoItbis: {
        type: Sequelize.DECIMAL
      },
      facturaProductoSubtotal: {
        type: Sequelize.DECIMAL
      },
      facturaProductoTotal: {
        type: Sequelize.DECIMAL
      },
      productoCantidad: {
        type: Sequelize.INTEGER
      },
      productoPrecio: {
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
    await queryInterface.dropTable('FacturaProductos');
  }
};
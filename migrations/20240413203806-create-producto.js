'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productoCod: {
        type: Sequelize.STRING
      },
      tipoProductoId: {
        type: Sequelize.INTEGER
      },
      productoNombre: {
        type: Sequelize.STRING
      },
      productoDescripcion: {
        type: Sequelize.STRING
      },
      productoPrecio: {
        type: Sequelize.DECIMAL
      },
      productoProveedor: {
        type: Sequelize.STRING
      },
      productoExistencia: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Productos');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clienteId: {
        type: Sequelize.INTEGER
      },
      clienteDni: {
        type: Sequelize.STRING
      },
      clienteNombre: {
        type: Sequelize.STRING
      },
      clienteApellido: {
        type: Sequelize.STRING
      },
      clienteEmail: {
        type: Sequelize.STRING
      },
      clienteTelefono: {
        type: Sequelize.STRING
      },
      clienteDireccion: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Clientes');
  }
};
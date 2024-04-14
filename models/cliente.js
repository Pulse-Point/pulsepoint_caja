'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cliente.init({
    clienteId: DataTypes.INTEGER,
    clienteDni: DataTypes.STRING,
    clienteNombre: DataTypes.STRING,
    clienteApellido: DataTypes.STRING,
    clienteEmail: DataTypes.STRING,
    clienteTelefono: DataTypes.STRING,
    clienteDireccion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cliente',
  });
  return Cliente;
};
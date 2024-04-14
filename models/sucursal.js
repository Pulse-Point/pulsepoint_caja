'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sucursal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sucursal.init({
    sucursalId: DataTypes.INTEGER,
    sucursalNombre: DataTypes.STRING,
    sucursalTelefono: DataTypes.STRING,
    sucursalDireccion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sucursal',
  });
  return Sucursal;
};
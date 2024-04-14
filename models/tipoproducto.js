'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoProducto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TipoProducto.init({
    tipoProductoId: DataTypes.INTEGER,
    tipoProducto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TipoProducto',
  });
  return TipoProducto;
};
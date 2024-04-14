'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FacturaProducto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FacturaProducto.init({
    facturaProductoId: DataTypes.INTEGER,
    productoCod: DataTypes.STRING,
    facturaCod: DataTypes.STRING,
    facturaProductoItbis: DataTypes.DECIMAL,
    facturaProductoSubtotal: DataTypes.DECIMAL,
    facturaProductoTotal: DataTypes.DECIMAL,
    productoCantidad: DataTypes.INTEGER,
    productoPrecio: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'FacturaProducto',
  });
  return FacturaProducto;
};
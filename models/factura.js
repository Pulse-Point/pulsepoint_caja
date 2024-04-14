'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Factura extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Factura.init({
    facturaCod: DataTypes.STRING,
    clienteId: DataTypes.INTEGER,
    sucursalId: DataTypes.INTEGER,
    facturaDetalle: DataTypes.STRING,
    facturaDescripcion: DataTypes.STRING,
    facturaMetodoPago: DataTypes.STRING,
    facturaItbis: DataTypes.DECIMAL,
    facturaSubtotal: DataTypes.DECIMAL,
    facturaTotal: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Factura',
  });
  return Factura;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contrato extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contrato.init({
    contratoId: DataTypes.INTEGER,
    clienteId: DataTypes.INTEGER,
    servicioCod: DataTypes.STRING,
    contratoDescripcion: DataTypes.STRING,
    servicioPrecio: DataTypes.DECIMAL,
    contratoFechaInicio: DataTypes.DATE,
    contratoFechaVencimiento: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Contrato',
  });
  return Contrato;
};
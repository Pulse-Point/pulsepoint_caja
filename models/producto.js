'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Producto.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productoCod: DataTypes.STRING,
    tipoProductoId: DataTypes.INTEGER,
    productoNombre: DataTypes.STRING,
    productoDescripcion: DataTypes.STRING,
    productoPrecio: DataTypes.DECIMAL,
    productoProveedor: DataTypes.STRING,
    productoExistencia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Producto',
  });
  return Producto;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Usuario.init({
    usuarioId: DataTypes.INTEGER,
    rolId: DataTypes.INTEGER,
    usuarioNombre: DataTypes.STRING,
    usuarioApellido: DataTypes.STRING,
    usuarioEmail: DataTypes.STRING,
    usuarioClave: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};
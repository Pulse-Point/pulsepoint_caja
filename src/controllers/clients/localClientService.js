const Cliente = require('../../../models/cliente');

module.exports = async (sequelize, DataTypes) => {
    const ClienteModel = Cliente(sequelize, DataTypes);

    const clients = await ClienteModel.findAll();
    return clients.map(client => client.dataValues);
};
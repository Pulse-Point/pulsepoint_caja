const Cliente = require('../../../models/cliente');
const formatString = require('../../utils/formatString')
const formatPhone = require('../../utils/formatPhone')

async function updateClient(sequelize, DataTypes, clientData) {
    const ClientModel = Cliente(sequelize, DataTypes);

    clientData.clienteDni = formatString(clientData.clienteDni);
    clientData.clienteTelefono = formatPhone(clientData.clienteTelefono);

    const client_toUpdate = {
        Dni: clientData.clienteDni,
        nombre: clientData.clienteNombre,
        apellido: clientData.clienteApellido,
        email: clientData.clienteEmail,
        telefono: clientData.clienteTelefono,
        direccion: clientData.clienteDireccion
    };

    const t = await sequelize.transaction();
    try {
        await ClientModel.update({
            clienteNombre: clientData.clienteNombre,
            clienteApellido: clientData.clienteApellido,
            clienteEmail: clientData.clienteEmail,
            clienteTelefono: clientData.clienteTelefono,
            clienteDireccion: clientData.clienteDireccion
        }, { where: { clienteDni: clientData.clienteDni }, transaction: t });
        await t.commit();
        return client_toUpdate;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = {
    updateClient
};
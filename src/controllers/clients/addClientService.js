const Cliente = require('../../../models/cliente');
const formatString = require('../../utils/formatString')
const formatPhone = require('../../utils/formatPhone')

async function addClient(sequelize, DataTypes, clientData) {
    const ClientModel = Cliente(sequelize, DataTypes);

    clientData.clienteDni = formatString(clientData.clienteDni);
    clientData.clienteTelefono = formatPhone(clientData.clienteTelefono);

    const client_toCreate = {
        Dni: clientData.clienteDni,
        nombre: clientData.clienteNombre,
        apellido: clientData.clienteApellido,
        email: clientData.clienteEmail,
        telefono: clientData.clienteTelefono,
        direccion: clientData.clienteDireccion
    };

    const t = await sequelize.transaction();
    try {
        const clientExists = await ClientModel.findOne({ where: { clienteDni: clientData.clienteDni }, transaction: t });
        if (clientExists) {
            await t.rollback();
            throw new Error('Client already exists');
        } else {
            await ClientModel.create({
                clienteDni: clientData.clienteDni,
                clienteNombre: clientData.clienteNombre,
                clienteApellido: clientData.clienteApellido,
                clienteEmail: clientData.clienteEmail,
                clienteTelefono: clientData.clienteTelefono,
                clienteDireccion: clientData.clienteDireccion
            }, { transaction: t });
        }
        await t.commit();
        return client_toCreate;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = {
    addClient
};
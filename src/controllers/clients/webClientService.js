import axios from 'axios';
import https from 'https';
import Cliente from '../../../models/cliente';

const webClientService = async (sequelize, DataTypes) => {
    const ClienteModel = Cliente(sequelize, DataTypes);

    const new_web_contacts = await axios.get(`https://26.105.234.68:7052/api/Clientes`, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: 3500
    });

    for (let contact of new_web_contacts.data) {
        const contactExists = await ClienteModel.findOne({ where: { clienteDni: contact.clienteDni } });
        if (!contactExists) {
            await ClienteModel.create({
                clienteDni: contact.clienteDni,
                clienteNombre: contact.clienteNombre,
                clienteApellido: contact.clienteApellido,
                clienteEmail: contact.clienteEmail,
                clienteTelefono: contact.clienteTelefono,
                clienteDireccion: contact.clienteDireccion
            });
        }
    }
};

export default webClientService;
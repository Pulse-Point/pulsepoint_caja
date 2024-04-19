import Contrato from '../../../models/contrato';
import Cliente from '../../../models/cliente';
import axios from 'axios';
import https from 'https';

const getWebContracts = async (sequelize, DataTypes, url) => {
    const ClientModel = Cliente(sequelize, DataTypes);
    const ContractModel = Contrato(sequelize, DataTypes);

    const new_web_contracts = await axios.get(url, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: 3500
    });

    for (let contract of new_web_contracts.data) {
        contract.clienteId += 13 // catch up to the core's db index
        const client = await ClientModel.findOne({ where: { id: contract.clienteId } });
        if (client) {
            await ContractModel.create({
                clienteDni: client.clienteDni,
                servicioCod: contract.servicioCod,
                contratoDescripcion: contract.contratoDescripcion,
                servicioPrecio: contract.servicioPrecio,
                contratoFechaInicio: contract.contratoFechaInicio,
                contratoFechaVencimiento: contract.contratoFechaVencimiento
            });
        }
    }
}

export default getWebContracts
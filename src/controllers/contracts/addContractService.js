const Contrato = require('../../../models/contrato');
const formatString = require('../../utils/formatString')

async function addContract(sequelize, DataTypes, contractData) {
    const ContractModel = Contrato(sequelize, DataTypes);

    contractData.clienteDni = formatString(contractData.clienteDni);

    const contract_toCreate = {
        clienteDni: contractData.clienteDni,
        servicioCod: contractData.servicioCod,
        contratoDescripcion: contractData.contratoDescripcion,
        servicioPrecio: contractData.servicioPrecio,
        contratoFechaInicio: contractData.contratoFechaInicio,
        contratoFechaVencimiento: contractData.contratoFechaVencimiento,
        Cliente: null,
        Servicio: null
    };

    const t = await sequelize.transaction();
    try {
        await ContractModel.create({
            clienteDni: contractData.clienteDni,
            servicioCod: contractData.servicioCod,
            contratoDescripcion: contractData.contratoDescripcion,
            servicioPrecio: contractData.servicioPrecio,
            contratoFechaInicio: contractData.contratoFechaInicio,
            contratoFechaVencimiento: contractData.contratoFechaVencimiento
        }, { transaction: t });

        await t.commit();
        return contract_toCreate;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = {
    addContract,
};
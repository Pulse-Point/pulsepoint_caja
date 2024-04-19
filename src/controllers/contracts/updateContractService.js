const Contrato = require('../../../models/contrato');

async function updateContract(sequelize, DataTypes, contractData) {
    const ContractModel = Contrato(sequelize, DataTypes);

    const contract_toUpdate = {
        clienteDni: contractData.clienteDni,
        servicioCod: contractData.servicioCod,
        contratoDescripcion: contractData.contratoDescripcion,
        servicioPrecio: contractData.servicioPrecio,
        contratoFechaInicio: contractData.contratoFechaInicio,
        contratoFechaVencimiento: contractData.contratoFechaVencimiento
    };

    const t = await sequelize.transaction();
    try {
        await ContractModel.update({
            servicioCod: contractData.servicioCod,
            contratoDescripcion: contractData.contratoDescripcion,
            servicioPrecio: contractData.servicioPrecio,
            contratoFechaInicio: contractData.contratoFechaInicio,
            contratoFechaVencimiento: contractData.contratoFechaVencimiento
        }, { where: { clienteDni: contractData.clienteDni }, transaction: t });

        await t.commit();
        return contract_toUpdate;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = {
    updateContract
};
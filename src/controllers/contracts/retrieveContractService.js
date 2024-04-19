const Contrato = require('../../../models/contrato')

async function getContracts(sequelize, DataTypes) {
    const ContractModel = Contrato(sequelize, DataTypes);
    const contracts = await ContractModel.findAll();
    return contracts.map(contract => contract.dataValues);
}

async function getContract(sequelize, DataTypes, dni) {
    const ContractModel = Contrato(sequelize, DataTypes);
    const contract = await ContractModel.findOne({ where: { clienteDni: dni } });
    return contract.dataValues;
}

module.exports = {
    getContracts,
    getContract,
};
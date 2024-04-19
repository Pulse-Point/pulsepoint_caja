const Factura = require('../../../models/factura');
const { formatString } = require('../../utils/formatString');

async function createBill(sequelize, DataTypes, billData) {
    const FacturaModel = Factura(sequelize, DataTypes);
    billData.clienteDni = formatString(billData.clienteDni)

    const billCount = await FacturaModel.count();
    let billCode = `FAC${billCount + 1}`;
    const billNumber = billCode.split('FAC')[1];
    if (billCount + 1 < 10) {
        billCode = `FAC00${billNumber}`;
    }
    else if (billCount + 1 < 100) {
        billCode = `FAC0${billNumber}`;
    }
    else {
        billCode = `FAC${billNumber}`;
    }

    const bill_toCreate = {
        facturaCod: billCode,
        clienteDni: billData.clienteDni,
        sucursalId: 1,
        facturaDetalle: billData.facturaDetalle,
        facturaDescripcion: 'Pago de contrato',
        facturaMetodoPago: billData.facturaMetodoPago,
        facturaItbis: billData.facturaSubtotal * 0.18,
        facturaSubtotal: billData.facturaSubtotal,
        facturaTotal: billData.facturaSubtotal + (billData.facturaSubtotal * 0.18)
    };

    const t = await sequelize.transaction();
    try {
        await FacturaModel.create({
            facturaCod: bill_toCreate.facturaCod,
            clienteDni: bill_toCreate.clienteDni,
            sucursalId: bill_toCreate.sucursalId,
            facturaDetalle: bill_toCreate.facturaDetalle,
            facturaDescripcion: bill_toCreate.facturaDescripcion,
            facturaMetodoPago: bill_toCreate.facturaMetodoPago,
            facturaItbis: bill_toCreate.facturaItbis,
            facturaSubtotal: bill_toCreate.facturaSubtotal,
            facturaTotal: bill_toCreate.facturaTotal
        }, { transaction: t });

        await t.commit();
        return bill_toCreate;
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = {
    createBill
};
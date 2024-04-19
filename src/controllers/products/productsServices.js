const Producto = require('../../../models/producto');
const TipoProducto = require('../../../models/tipoproducto');

async function getProducts(sequelize, DataTypes) {
    const ProductModel = Producto(sequelize, DataTypes);
    const products = await ProductModel.findAll();
    return products.map(product => product.dataValues);
}

async function getProductTypes(sequelize, DataTypes) {
    const ProductTypeModel = TipoProducto(sequelize, DataTypes);    
    const productTypes = await ProductTypeModel.findAll();
    return productTypes.map(productType => productType.dataValues);
}

module.exports = {
    getProducts,
    getProductTypes
};
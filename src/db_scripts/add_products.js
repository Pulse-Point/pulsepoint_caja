const { ipcMain } = require('electron')
const { db, DataTypes } = require('../models/index')

// Create base product types
ipcMain.on('create-base-products', async () => {
    const Producto = require('../models/producto')(db.sequelize, DataTypes)

    console.log('create-base-products event received')

    const Products_ToCreate = [
        {
            productoCod: 'AUD001',
            tipoProductoId: 7,
            productoNombre: '9S Auriculares Bluetooth Plegables',
            productoDescripcion: '9S Auriculares Bluetooth Plegables',
            productoPrecio: 4859.0000,
            productoProveedor: 'Generic',
            productoExistencia: 40
        },
        {
            productoCod: 'AUD002',
            tipoProductoId: 7,
            productoNombre: 'VSG Shake Audífonos Gamer 7.1',
            productoDescripcion: 'VSG Shake Audífonos Gamer 7.1',
            productoPrecio: 6479.0000,
            productoProveedor: 'VSG',
            productoExistencia: 35
        },
        {
            productoCod: 'AUD003',
            tipoProductoId: 7,
            productoNombre: 'Auriculares TWS Avenzo',
            productoDescripcion: 'Auriculares TWS Deportivos marca Avenzo',
            productoPrecio: 2699.0000,
            productoProveedor: 'Avenzo',
            productoExistencia: 50
        },
        {
            productoCod: 'AUD004',
            tipoProductoId: 7,
            productoNombre: 'Beats Studio Pro',
            productoDescripcion: 'Beats Studio Pro Wireless',
            productoPrecio: 14299.0000,
            productoProveedor: 'Beats',
            productoExistencia: 30
        },
        {
            productoCod: 'AUD005',
            tipoProductoId: 7,
            productoNombre: 'Beats Auriculares inalámbricos Flex',
            productoDescripcion: 'Beats Auriculares inalámbricos Flex',
            productoPrecio: 5399.0000,
            productoProveedor: 'Beats',
            productoExistencia: 45
        },
        {
            productoCod: 'CEL001',
            tipoProductoId: 5,
            productoNombre: 'Samsung Galaxy A54 White',
            productoDescripcion: 'Samsung Galaxy A54 color blanco',
            productoPrecio: 18899.0000,
            productoProveedor: 'Samsung',
            productoExistencia: 50
        },
        {
            productoCod: 'CEL002',
            tipoProductoId: 5,
            productoNombre: 'ZTE Blade L9 Azul Telcel',
            productoDescripcion: 'ZTE Blade L9 color azul, Telcel',
            productoPrecio: 3239.0000,
            productoProveedor: 'ZTE',
            productoExistencia: 30
        },
        {
            productoCod: 'CEL003',
            tipoProductoId: 5,
            productoNombre: 'Galaxy-A55 5G',
            productoDescripcion: 'Samsung Galaxy A55 5G',
            productoPrecio: 21599.0000,
            productoProveedor: 'Samsung',
            productoExistencia: 20
        },
        {
            productoCod: 'CEL004',
            tipoProductoId: 5,
            productoNombre: 'Samsung Galaxy A04 Blanco',
            productoDescripcion: 'Samsung Galaxy A04 color blanco',
            productoPrecio: 8099.0000,
            productoProveedor: 'Samsung',
            productoExistencia: 25
        },
        {
            productoCod: 'LAP001',
            tipoProductoId: 6,
            productoNombre: 'Lenovo Ideapad Gaming 3',
            productoDescripcion: 'Lenovo Ideapad Gaming 3 15ARH7',
            productoPrecio: 54599.0000,
            productoProveedor: 'Lenovo',
            productoExistencia: 15
        },
        {
            productoCod: 'LAP002',
            tipoProductoId: 6,
            productoNombre: 'MSI Thin 15 B12VE-1476XCR',
            productoDescripcion: 'MSI Thin 15 modelo B12VE-1476XCR',
            productoPrecio: 75999.0000,
            productoProveedor: 'MSI',
            productoExistencia: 10
        },
        {
            productoCod: 'LAP003',
            tipoProductoId: 6,
            productoNombre: 'HP Victus 15-FA1093DX',
            productoDescripcion: 'Victus 15-FA1093DX',
            productoPrecio: 59999.0000,
            productoProveedor: 'HP',
            productoExistencia: 8
        },
        {
            productoCod: 'REP001',
            tipoProductoId: 8,
            productoNombre: 'Repetidor WiFi Xiaomi Pro',
            productoDescripcion: 'Repetidor WiFi Xiaomi Pro',
            productoPrecio: 2159.0000,
            productoProveedor: 'Xiaomi',
            productoExistencia: 60
        },
        {
            productoCod: 'REP002',
            tipoProductoId: 8,
            productoNombre: 'Repetidor Wi-Fi* 2,4 GHz (B/G/N)',
            productoDescripcion: 'Repetidor Wi-Fi 2,4 GHz estándar B/G/N',
            productoPrecio: 1079.0000,
            productoProveedor: 'Generic',
            productoExistencia: 75
        },
        {
            productoCod: 'REP003',
            tipoProductoId: 8,
            productoNombre: 'Repetidor WiFi 300Mbps TL-WA855Re 2.4Ghz',
            productoDescripcion: 'Repetidor WiFi 300Mbps TL-WA855Re 2.4Ghz',
            productoPrecio: 3239.0000,
            productoProveedor: 'TP-Link',
            productoExistencia: 30
        },

    ]

    try {

        Products_ToCreate.forEach(product => {
            Producto.create(
                {
                    productoCod: product.productoCod,
                    tipopProductoId: product.tipopProductoId,
                    productoNombre: product.productoNombre,
                    productoDescripcion: product.productoDescripcion,
                    productoPrecio: product.productoPrecio,
                    productoProveedor: product.productoProveedor,
                    productoExistencia: product.productoExistencia
                }
            )
        })

        console.log('Base products created')
    } catch (error) {
        console.log('Error creating base products:', error)
    }
})
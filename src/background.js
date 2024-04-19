'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { DataTypes } from 'sequelize'
import axios from 'axios'
const isDevelopment = process.env.NODE_ENV !== 'production'
require('@electron/remote/main').initialize() // enable IPC communication
const db = require('../models')
const { ipcMain } = require('electron')
require('dotenv').config()
const API_URL = process.env.API_URL

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: isDevelopment ? 1200 : 800,
    height: isDevelopment ? 800 : 600,
    icon: 'src/assets/icons/pulsepoint_app_logo.png',
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      preload: 'preload.js'
    }
  })

  // disable menu bar   
  win.setMenuBarVisibility(false)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // initialize database
  db.sequelize.sync().then(()=>{
    console.log('Conexión a la base de datos establecida')
  }).catch(err => {
    console.log('Error al conectar a la base de datos:', err)
  })

  retryFailedRequests().then(() => {
    console.log('cola de peticiones fallidas inicializada')
  }).catch(err => {
    console.log('Error al inicializar cola de peticiones fallidas:', err)
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// Database processes/listeners

// Request queue for failed attempts
const Store = require('electron-store');
const store = new Store();
let requestQueue = store.get('requestQueue', []);

async function sendRequest(endpoint, data, method) {
  // Load the request queue from electron-store

  let response;
  try {
    if (method === 'POST') {
      response = await axios.post(endpoint, {
        ...data
      }, {
        timeout: 5000
      });
    } else if (method === 'PUT') {
      response = await axios.put(endpoint, {
        ...data
      }, {
        timeout: 5000
      });
    }

    console.log('Response:', response.data);
  } catch (error) {
    requestQueue.push({ endpoint, data, method });
    store.set('requestQueue', requestQueue);
  }
}

async function retryFailedRequests() {
  let newQueue = [];

  if (requestQueue.length === 0) {
    // Retry failed requests every 8 seconds
    setTimeout(retryFailedRequests, 8000);
    return;
  }

  console.log('Retrying failed requests:', requestQueue);
  
  for (let request of requestQueue) {
    try {      
      await sendRequest(request.endpoint, request.data, request.method);
    } catch (error) {
      newQueue.push(request);
    }
  }

  requestQueue = newQueue;
  store.set('requestQueue', requestQueue);

  // Retry failed requests every 8 seconds
  setTimeout(retryFailedRequests, 8000);
}

/* INVENTORY VIEW */

const { getProducts, getProductTypes } = require('./controllers/products/productsServices');

ipcMain.on('retrieve-products', async (event) => {
  console.log('retrieve-products event received');

  try {
    const productsData = await getProducts(db.sequelize, DataTypes);
    console.log('products retrieved:', productsData);
    event.sender.send('products', productsData);
  } catch (error) {
    console.log('Error retrieving products:', error);
  }
});

ipcMain.on('retrieve-product-types', async (event) => {
  console.log('retrieve-product-types event received');

  try {
    const productTypesData = await getProductTypes(db.sequelize, DataTypes);
    console.log('product types retrieved:', productTypesData);
    event.sender.send('product-types', productTypesData);
  } catch (error) {
    console.log('Error retrieving product types:', error);
  }
});

/* CLIENT VIEW */

import webClientService from './controllers/clients/webClientService'
const localClientService = require('./controllers/clients/localClientService')

ipcMain.on('retrieve-clients', async (event) => {
  console.log('retrieve-clients event received');

  try {
    await webClientService(db.sequelize, DataTypes);
    console.log('web contacts retrieved');
  } catch (error) {
    console.log('Error retrieving web contacts:', error);
  }

  try {
    const clientsData = await localClientService(db.sequelize, DataTypes);
    console.log('clients retrieved:', clientsData);
    event.sender.send('clients', clientsData);
  } catch (error) {
    console.log('Error retrieving clients:', error);
  }
});

// retrieve a client
ipcMain.on('retrieve-a-client', async (event, dni) => {
  const Cliente = require('../models/cliente')(db.sequelize, DataTypes)

  console.log('retrieve-a-client event received')

  try {
    console.log('dni:', dni)
    Cliente.findOne({ where: { clienteDni: dni } }).then(client => {
      const clientData = client.dataValues

      console.log('client retrieved:', clientData)

      event.sender.send('client-retrieved', clientData)
    })
  } catch (error) {
    event.sender.send('error-retrieving-client', error)
  }
})

// import utils
const formatString = require('./utils/formatString')

const { addClient } = require('./controllers/clients/addClientService');

ipcMain.on('add-client', async (event, clientData) => {
  console.log('add-client event received');

  try {
    const client = await addClient(db.sequelize, DataTypes, clientData);
    event.sender.send('client-added', client);
    console.log('api_url:', API_URL);
    sendRequest(`${API_URL}/api/Clientes/`, clientData, 'POST');
    console.log('sent to server');
  } catch (error) {
    event.sender.send('error-adding-client', error);
    console.log('sent error adding client');
  }
});

const { updateClient } = require('./controllers/clients/updateClientService');

ipcMain.on('update-client', async (event, clientData) => {
  console.log('update-client event received');

  try {
    const client = await updateClient(db.sequelize, DataTypes, clientData);
    event.sender.send('client-updated', client);
    console.log('Client updated:', client);

    // send request to server
    await sendRequest(`${API_URL}/api/Clientes/${client.clienteDni}`, clientData, 'PUT');
  } catch (error) {
    event.sender.send('error-updating-client', error);
    console.log('sent error updating client');
  }
});

/* CONTRACTS VIEW */

// retrieve services
ipcMain.on('retrieve-services', async (event) => {
  const Servicio = require('../models/servicio')(db.sequelize, DataTypes)

  console.log('retrieve-services event received')

  try {
    Servicio.findAll().then(services => {
      const servicesData = services.map(service => service.dataValues)

      console.log('services retrieved:', servicesData)

      event.sender.send('services-retrieved', servicesData)
    })
  } catch (error) {
    console.log('Error retrieving services:', error)
  }
})

const { getContracts, getContract } = require('./controllers/contracts/retrieveContractService')
import getWebContracts from './controllers/contracts/retrieveWebContractService'

ipcMain.on('retrieve-contracts', async (event) => {
  console.log('retrieve-contracts event received');

  try {
    getWebContracts(db.sequelize, DataTypes, `https://26.105.234.68:7052/api/Contratos`);
    const contractsData = await getContracts(db.sequelize, DataTypes);
    console.log('contracts retrieved:', contractsData);
    event.sender.send('contracts-retrieved', contractsData);
  } catch (error) {
    console.log('Error retrieving contracts:', error);
  }
});

ipcMain.on('retrieve-a-contract', async (event, dni) => {
  console.log('retrieve-a-contract event received');

  try {
    const contractData = await getContract(db.sequelize, DataTypes, dni);
    console.log('contract retrieved:', contractData);
    event.sender.send('contract-retrieved', contractData);
  } catch (error) {
    event.sender.send('error-retrieving-contract', error);
  }
});

const { addContract } = require('./controllers/contracts/addContractService');
const { updateContract } = require('./controllers/contracts/updateContractService');

ipcMain.on('add-contract', async (event, contractData) => {
  console.log('add-contract event received');

  try {
    const contract = await addContract(db.sequelize, DataTypes, contractData);
    event.sender.send('contract-added', contract);
    console.log('New contract added:', contract);

    // send request to server  
    await sendRequest(`https://26.105.234.68:7052/api/Contratos`, contract, 'POST');
  } catch (error) {
    event.sender.send('error-adding-contract', error);
    console.log('sent error adding contract');
  }
});

ipcMain.on('update-contract', async (event, contractData) => {
  console.log('update-contract event received');

  try {
    const contract = await updateContract(db.sequelize, DataTypes, contractData);
    event.sender.send('contract-updated', contract);
    console.log('Contract updated:', contract);

    // send request to server  
    await sendRequest(`${API_URL}/api/Contrato`, contract, 'PUT');
  } catch (error) {
    event.sender.send('error-updating-contract', error);
    console.log('sent error updating contract');
  }
});

const { createBill } = require('./controllers/facturas/billService');

ipcMain.on('create-contract-bill', async (event, billData) => {
  console.log('create-contract-bill event received');

  try {
    const bill = await createBill(db.sequelize, DataTypes, billData);
    event.sender.send('contract-bill-created', bill);
    console.log('New bill created:', bill);

    // send request to server  
    await sendRequest(`${API_URL}/api/Facturas`, bill, 'POST');
  } catch (error) {
    event.sender.send('error-creating-bill', error);
    console.log('sent error creating bill');
  }
});

// retrieve a bill
ipcMain.on('retrieve-a-bill', async (event, dni) => {
  const Factura = require('../models/factura')(db.sequelize, DataTypes)

  console.log('dni:', dni)

  console.log('retrieve-contract-bill event received')

  try {
    Factura.findOne({ where: { clienteDni: dni } }).then(bill => {
      const billData = bill.dataValues

      console.log('bill retrieved:', billData)

      event.sender.send('bill-retrieved', billData)
    })
  } catch (error) {
    event.sender.send('error-retrieving-bill', error)
  }
})

ipcMain.on('retrieve-facturas', async (event) => {
  const Factura = require('../models/factura')(db.sequelize, DataTypes)
  const { Op } = require('sequelize');

  console.log('retrieve-facturas event received')

  try {
    // retrieve all bills that arent related to a contract
    Factura.findAll({
      where: {
        facturaDescripcion: {
          [Op.notLike]: '%contrato%'
        }
      }
    }).then(facturas => {
      const facturasData = facturas.map(factura => factura.dataValues)
    
      console.log('facturas retrieved:', facturasData)
    
      event.sender.send('facturas', facturasData)
    })
  } catch (error) {
    console.log('Error retrieving facturas:', error)
  }
})

// create-sale-bill
ipcMain.on('create-sale-bill', async (event, billData, salesToSend) => {
  const Factura = require('../models/factura')(db.sequelize, DataTypes)
  const FacturaProducto = require('../models/facturaproducto')(db.sequelize, DataTypes)
  const Producto = require('../models/producto')(db.sequelize, DataTypes)

  console.log('create-sale-bill event received')

  const billCount = await Factura.count()
  let billCode = `FAC${billCount + 1}`
  const billNumber = billCode.split('FAC')[1]
  if (billCount+1 < 10) {
    billCode = `FAC00${billNumber}`
  }
  else if (billCount+1 < 100) {
    billCode = `FAC0${billNumber}`
  }
  else {
    billCode = `FAC${billNumber}`
  }

  billData.clienteDni = formatString(billData.clienteDni)

  const bill_toCreate = {
    facturaCod: billCode,
    clienteDni: billData.clienteDni,
    sucursalId: 1,
    facturaDetalle: billData.facturaDetalle,
    facturaDescripcion: billData.facturaDescripcion,
    facturaMetodoPago: billData.facturaMetodoPago,
    facturaItbis: billData.facturaTotal * 0.18,
    facturaSubtotal: billData.facturaTotal,
    facturaTotal: billData.facturaTotal + (billData.facturaTotal * 0.18)
  }

  console.log('bill to create:', bill_toCreate)
  console.log('sales to create:', salesToSend)

  const t = await db.sequelize.transaction();
  try {
    // save in local database
    await Factura.create({
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

    for (let sale of salesToSend) {
      // find the product with the code
      const product = await Producto.findOne({ where: { productoCod: sale.productoCod } });
      if (!product) {
        event.sender.send('error-creating-sale-bill', 'Producto no encontrado')
        await t.rollback();
        return;
      }

      await FacturaProducto.create({        
        facturaCod: billCode,
        facturaProductoId: product.id,
        productoCod: sale.productoCod,
        productoCantidad: sale.productoCantidad,
        productoPrecio: product.productoPrecio,
        facturaProductoItbis: sale.itbis,
        facturaProductoSubtotal: sale.subtotal,
        facturaProductoTotal: sale.total
      }, { transaction: t });

      // update product stock
      await Producto.update({
        productoExistencia: product.productoExistencia - sale.productoCantidad
      }, { where: { productoCod: sale.productoCod }, transaction: t });

      // send request to server
      await sendRequest(`${API_URL}/api/Facturas/`, {
        facturaCod: billCode,
        facturaProductoId: product.id,
        productoCod: sale.productoCod,
        productoCantidad: sale.productoCantidad,
        productoPrecio: product.productoPrecio,
        facturaProductoItbis: sale.itbis,
        facturaProductoSubtotal: sale.subtotal,
        facturaProductoTotal: sale.total
      }, 'POST')
    }
  
    await t.commit();
    event.sender.send('sale-bill-created', billCode)
    console.log('New bill created:', bill_toCreate)

  } catch (error) {
    await t.rollback();
    event.sender.send('error-creating-sale-bill', error)
  }

  // send request to server
  await sendRequest(`${API_URL}/api/Facturas`, bill_toCreate, 'POST')
})

// retrieve-bill-and-sales
ipcMain.on('retrieve-bill-and-sales', async (event, facturaCod) => {
  const Factura = require('../models/factura')(db.sequelize, DataTypes)
  const FacturaProducto = require('../models/facturaproducto')(db.sequelize, DataTypes)

  console.log('retrieve-bill-and-sales event received')

  try {
    Factura.findOne({ where: { facturaCod } }).then(bill => {
      const billData = bill.dataValues

      FacturaProducto.findAll({ where: { facturaCod } }).then(sales => {
        const salesData = sales.map(sale => sale.dataValues)
        console.log('bill and sales retrieved:', billData, salesData)
        event.sender.send('bill-and-sales-retrieved', billData, salesData)
      })
    })
  } catch (error) {
    event.sender.send('error-retrieving-bill-and-sales', error)
  }
})

// retrieve-all-bills-and-sales
ipcMain.on('retrieve-all-bills-and-sales', async (event) => {
  const Factura = require('../models/factura')(db.sequelize, DataTypes)
  const FacturaProducto = require('../models/facturaproducto')(db.sequelize, DataTypes)

  console.log('retrieve-all-bills-and-sales event received')

  try {
    Factura.findAll().then(bills => {
      const billsData = bills.map(bill => bill.dataValues)

      FacturaProducto.findAll().then(sales => {
        const salesData = sales.map(sale => sale.dataValues)
        console.log('all bills and sales retrieved:', billsData, salesData)
        event.sender.send('all-bills-and-sales-retrieved', billsData, salesData)
      })
    })
  } catch (error) {
    event.sender.send('error-retrieving-all-bills-and-sales', error)
  }
})

// deleete bill-and-sales
ipcMain.on('delete-bill-and-sales', async (event, facturaCod) => {
  const Factura = require('../models/factura')(db.sequelize, DataTypes)
  const FacturaProducto = require('../models/facturaproducto')(db.sequelize, DataTypes)
  const Producto = require('../models/producto')(db.sequelize, DataTypes)

  console.log('delete-bill-and-sales event received')

  const t = await db.sequelize.transaction();
  try {
    // delete sales
    const sales = await FacturaProducto.findAll({ where: { facturaCod }, transaction: t });
    for (let sale of sales) {
      // find the product with the code
      const product = await Producto.findOne({ where: { productoCod: sale.productoCod } });
      if (!product) {
        event.sender.send('error-deleting-bill-and-sales', 'Producto no encontrado')
        await t.rollback();
        return;
      }

      await FacturaProducto.destroy({ where: { facturaCod, productoCod: sale.productoCod }, transaction: t });

      // update product stock
      await Producto.update({
        productoExistencia: product.productoExistencia + sale.productoCantidad
      }, { where: { productoCod: sale.productoCod }, transaction: t });
    }

    // delete bill
    await Factura.destroy({ where: { facturaCod }, transaction: t });

    await t.commit();
    event.sender.send('bill-and-sales-deleted', facturaCod)
    console.log('bill and sales deleted:', facturaCod)
  } catch (error) {
    await t.rollback();
    event.sender.send('error-deleting-bill-and-sales', error)
  }

  // send request to server
  await sendRequest(`${API_URL}/api/Factura/${facturaCod}`, null, 'DELETE')
})
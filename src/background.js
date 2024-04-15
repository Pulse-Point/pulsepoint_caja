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

let requestQueue = []

async function sendRequest(endpoint, data, method) {
  let response;
  try {
    if (method === 'POST') {
      response = await axios.post(endpoint, data);
    } else if (method === 'PUT') {
      response = await axios.put(endpoint, data);
    }

    console.log('Response:', response.data);
  } catch (error) {
    console.log('Error sending request:', error);
    requestQueue.push({ endpoint, data });
  }
}

async function retryFailedRequests() {
  let newQueue = [];

  console.log('Retrying failed requests:', requestQueue);
  
  for (let request of requestQueue) {
    try {
      const response = await axios.post(request.endpoint, request.data);
      console.log('Response:', response.data);
    } catch (error) {
      console.log('Error sending request:', error);
      newQueue.push(request);
    }
  }

  requestQueue = newQueue;

  // Retry failed requests every 10 seconds
  setTimeout(retryFailedRequests, 10000);
}

/* INVENTORY VIEW */

// retrieve products
ipcMain.on('retrieve-products', async (event) => {
  const Producto = require('../models/producto')(db.sequelize, DataTypes)

  console.log('retrieve-products event received')

  try {
    Producto.findAll().then(products => {
      const productsData = products.map(product => product.dataValues)
      console.log('products retrieved:', products)

      event.sender.send('products', productsData)
    })
  } catch (error) {
    console.log('Error retrieving products:', error)
  }
})

// retrieve product types
ipcMain.on('retrieve-product-types', async (event) => {
  const TipoProducto = require('../models/tipoproducto')(db.sequelize, DataTypes)

  console.log('retrieve-product-types event received')

  try {
    TipoProducto.findAll().then(productTypes => {
      const productTypesData = productTypes.map(productType => productType.dataValues)

      console.log('product types retrieved:', productTypesData)

      event.sender.send('product-types', productTypesData)
    })
  } catch (error) {
    console.log('Error retrieving product types:', error)
  }
})

/* CLIENT VIEW */

// retrieve clients
ipcMain.on('retrieve-clients', async (event) => {
  const Cliente = require('../models/cliente')(db.sequelize, DataTypes)

  console.log('retrieve-clients event received')

  try {
    Cliente.findAll().then(clients => {
      const clientsData = clients.map(client => client.dataValues)

      console.log('clients retrieved:', clientsData)

      event.sender.send('clients', clientsData)
    })
  } catch (error) {
    console.log('Error retrieving clients:', error)
  }
})

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


// add client
ipcMain.on('add-client', async (event, clientData) => {
  const Cliente = require('../models/cliente')(db.sequelize, DataTypes)

  console.log('add-client event received')

  const client_toCreate = {
    Dni: clientData.clienteDni,
    nombre: clientData.clienteNombre,
    apellido: clientData.clienteApellido,
    email: clientData.clienteEmail,
    telefono: clientData.clienteTelefono,
    direccion: clientData.clienteDireccion
  }
  
  const t = await db.sequelize.transaction();
  try {

    // save in local database
    const clientExists = await Cliente.findOne({ where: { clienteDni: clientData.clienteDni }, transaction: t });
    if (clientExists) {
      event.sender.send('client-already-exists', clientData.clienteDni)
      await t.rollback();
      return;
    
    } else {
      await Cliente.create({
        clienteDni: clientData.clienteDni,
        clienteNombre: clientData.clienteNombre,
        clienteApellido: clientData.clienteApellido,
        clienteEmail: clientData.clienteEmail,
        clienteTelefono: clientData.clienteTelefono,
        clienteDireccion: clientData.clienteDireccion
      }, { transaction: t });
    }    
    await t.commit();
    event.sender.send('client-added', client_toCreate.dataValues)
    console.log('New client added:', client_toCreate.dataValues)

  } catch (error) {
    await t.rollback();
    event.sender.send('error-adding-client', error)
    console.log('sent error adding client')
  }

  // send request to server  
  await sendRequest('http://26.92.45.172:4750/api/Cliente', client_toCreate, 'POST')
})

// update client
ipcMain.on('update-client', async (event, clientData) => {
  const Cliente = require('../models/cliente')(db.sequelize, DataTypes)

  console.log('update-client event received')

  const client_toUpdate = {
    Dni: clientData.clienteDni,
    nombre: clientData.clienteNombre,
    apellido: clientData.clienteApellido,
    email: clientData.clienteEmail,
    telefono: clientData.clienteTelefono,
    direccion: clientData.clienteDireccion
  }

  const t = await db.sequelize.transaction();
  try {
    // save in local database
    await Cliente.update({
      clienteNombre: clientData.clienteNombre,
      clienteApellido: clientData.clienteApellido,
      clienteEmail: clientData.clienteEmail,
      clienteTelefono: clientData.clienteTelefono,
      clienteDireccion: clientData.clienteDireccion
    }, { where: { clienteDni: clientData.clienteDni }, transaction: t });
    await t.commit();
    event.sender.send('client-updated', client_toUpdate)
    console.log('Client updated:', client_toUpdate)

  } catch (error) {
    await t.rollback();
    event.sender.send('error-updating-client', error)
    console.log('sent error updating client')
  }

  // send request to server
  await sendRequest(`http://http://26.92.45.172:4750/api/Cliente/${client_toUpdate.clienteDni}`, client_toUpdate, 'PUT')
})


'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { DataTypes } from 'sequelize'
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
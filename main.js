// Modules to control application life and create native browser window

//BACKEND

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default

require('dotenv').config()

const Store = require('electron-store')
const store = new Store()


const cabinsAPI = process.env.cabinsAPI
const serviceAPI = process.env.serviceAPI

console.log(cabinsAPI)

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: false // true to hide, press Alt to show when hidden
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open DevTools automatically (comment out if you don't want it)
  mainWindow.webContents.openDevTools()

}

// Called when Electron is ready to create browser windows.
app.whenReady().then(() => {


  createWindow()

  // Check original template for MacOS stuff!
})

//get/cabins
ipcMain.handle('get-cabins', async () => {
  console.log('get-cabins (main)')


  try {
    const resp = await fetch(cabinsAPI + '/cabins/owned', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + store.get('jwt')
      }
    })

    const cabins = await resp.json()

    if (resp.status > 201) {
      console.log(cabins)
      return false
    }

    return cabins

  } catch (error) {
    console.log("Error: " + error.message)
    return false
  }

})

//Get-services

ipcMain.handle('get-services', async () => {
  console.log('get-services (main)')


  try {
    const resp = await fetch(serviceAPI + '/services', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const services = await resp.json()

    if (resp.status > 201) {
      console.log(services)
      return false
    }

    return services

  } catch (error) {
    console.log("Error: " + error.message)
    return false
  }

})


//ORDERS
ipcMain.handle('get-orders', async () => {
  console.log('get-orders (main)')


  try {
    const resp = await fetch(serviceAPI + '/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const orders = await resp.json()

    if (resp.status > 201) {
      console.log(orders)
      return false
    }

    return orders

  } catch (error) {
    console.log("Error: " + error.message)
    return false
  }

})
//LOGIN STEP 3
//
ipcMain.handle('cabins-login', async (event, data) => {
  console.log('cabins-login (main)')
  try {
    const resp = await fetch(cabinsAPI + '/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)//,
      // timeout: 3000
    })
    const user = await resp.json()
    console.log(user)

    //Login failed
    //Returnar REST error message
    //user == error msg
    if (resp.status > 201) return user

    //Login success
    //JWT-Token
    store.set('jwt', user.token)
    return false // false = login succeeded


  }
  //Login failed
  catch (error) {
    console.log(error.message)
    return { 'msg': "Login failed." }
  }

})

//Radera order
ipcMain.handle('del-order', async (event, data) => {
  console.log("Send DELETE request to API: /orders/" + data)

  try {
    const resp = await fetch(serviceAPI + '/orders/' + data, {
      //_id: data
      method: 'DELETE'
    })
    console.log("Booking deleted")

  }
  catch (error) {
    console.log("Error: " + error.message)
  }


})

ipcMain.handle('edit-order', async (event, data, date) => {
  console.log("Send edit request to API: /orders/" + data)

  try {
    //const data = { date: date };
    const resp = await fetch(serviceAPI + '/orders/' + data, {
      _id: data,
      method: 'PATCH',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(date),
      
    })
    const order = await resp.json()
    console.log(order)
    console.log("order date " + date)

    return(order.msg)


  }
  catch (error) {
    console.log("Error: " + error.message)
  }


})


app.on('window-all-closed', function () {
  app.quit()
  // Check original template for MacOS stuff!
})

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fetch = require('electron-fetch').default

require('dotenv').config()

const Store = require('electron-store')
const store = new Store()


const cabinsAPI = process.env.cabinsAPI

console.log(cabinsAPI)

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

// Example functions for communication between main and renderer (backend/frontend)
ipcMain.handle('get-cabins', async () => {
  console.log('get-cabins (main)')
  try {
    const resp = await fetch(cabinsAPI + '/cabins', {
      headers: { 'Authorization': 'Bearer ' + store.get('jwt') },
      timeout: 2000
    })
    const cabins = await resp.json()
    if (resp.status > 201) {
      console.log(cabins)
      return false
    }

    return cabins

  } catch (error) {
    console.log(error.message)
    return false
  }

})

//LOGIN
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

    if (resp.status > 201) return user


    //JWT-Token
    store.set('jwt', user.token)
    return false // false = login succeeded


  } 
  //LOGIN FAILED
  catch (error) {
    console.log(error.message)
    return { 'msg': "Login failed."}
  }

})
//ipcMain.handle('save-cabin', async (event, data) => console.log(data))


app.on('window-all-closed', function () {
  app.quit()
  // Check original template for MacOS stuff!
})

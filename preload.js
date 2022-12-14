/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules
 */

//FRONTEND <-> BACKEND 
 const { contextBridge, ipcRenderer } = require('electron')

 contextBridge.exposeInMainWorld('electron', {
 
   getCabins: () => ipcRenderer.invoke('get-cabins'),
 
   getServices: () => ipcRenderer.invoke('get-services'),
   getOrders: () => ipcRenderer.invoke('get-orders'),
   //LOGIN STEP 2
   //cabins-login --> main.js
   cabinsLogin: (data) => ipcRenderer.invoke('cabins-login', data),
 
 
    delOrder: (data) => ipcRenderer.invoke('del-order', data),
    editOrder: (data) => ipcRenderer.invoke('edit-order', data)
 
 
 })
 
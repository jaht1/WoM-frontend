/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules
 */
 const { contextBridge, ipcRenderer } = require('electron')

 contextBridge.exposeInMainWorld('electron', {
 
   getCabins: () => ipcRenderer.invoke('get-cabins'),
 
   //cabins-login --> main.js
   cabinsLogin: (data) => ipcRenderer.invoke('cabins-login', data),
 
  // saveNote: (data) => ipcRenderer.invoke('save-note', data),
 
  // delNote: (data) => ipcRenderer.invoke('del-note', data)
 
 
 })
 
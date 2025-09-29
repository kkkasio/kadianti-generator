import { contextBridge, ipcRenderer } from 'electron';


// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

contextBridge.exposeInMainWorld('api', {

  getAppVersion: () => {
    return ipcRenderer.invoke("get:app:version")
  },

  openFolderDialog: () => {
    return ipcRenderer.invoke("dialog:folder:open")
  },

  onDefaultError: (callback: Callback) => {
    ipcRenderer.removeAllListeners("error:default")
    ipcRenderer.on("error:default", (event, error) => callback(error))
  },
});

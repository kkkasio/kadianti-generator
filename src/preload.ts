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

  // Storage methods
  getProjects: () => {
    return ipcRenderer.invoke("storage:getProjects")
  },

  saveProject: (project: any) => {
    return ipcRenderer.invoke("storage:saveProject", project)
  },

  removeProject: (projectId: string) => {
    return ipcRenderer.invoke("storage:removeProject", projectId)
  },

  getActiveProject: () => {
    return ipcRenderer.invoke("storage:getActiveProject")
  },

  setActiveProject: (projectId: string | null) => {
    return ipcRenderer.invoke("storage:setActiveProject", projectId)
  },
});

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  selectDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  checkAdiantiProject: (path: string) => ipcRenderer.invoke('fs:checkAdiantiProject', path),
  
  // Storage operations
  getProjects: () => ipcRenderer.invoke('storage:getProjects'),
  saveProject: (project: any) => ipcRenderer.invoke('storage:saveProject', project),
  removeProject: (projectId: string) => ipcRenderer.invoke('storage:removeProject', projectId),
  
  // Project operations
  readModels: (projectPath: string) => ipcRenderer.invoke('project:readModels', projectPath),
  generateCode: (options: any) => ipcRenderer.invoke('project:generateCode', options),
});

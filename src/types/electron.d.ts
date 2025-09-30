declare global {
  interface Window {
    api: ElectronApi
  }
}


/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  getBaseUrl: () => string,
  getAppVersion: () => Promise<string>,
  openFolderDialog: () => Promise<string>,
  onDefaultError: (callback: Callback) => void,
  
  // Storage methods
  getProjects: () => Promise<import('./index').AdiantiProject[]>,
  saveProject: (project: Omit<import('./index').AdiantiProject, 'id' | 'createdAt'>) => Promise<import('./index').AdiantiProject>,
  removeProject: (projectId: string) => Promise<boolean>,
  getActiveProject: () => Promise<import('./index').AdiantiProject | null>,
  setActiveProject: (projectId: string | null) => Promise<boolean>,
}
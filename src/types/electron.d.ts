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
}
import { BrowserWindow } from "electron";

export default class Storage {

  static window: BrowserWindow | null = null;

  static async getAll() {
    if (!Storage.hasWindow()) return null;

    return await Storage.getWindow().webContents.executeJavaScript(`({...localStorage})`, true)
  }

  async get(key: string) {
    if (!Storage.hasWindow()) return null;

    return await Storage.getWindow().webContents.executeJavaScript(`localStorage.getItem('${key}')`, true)
  }

  async set(key: string, value: string) {
    if (!Storage.hasWindow()) return null;
    return await Storage.getWindow().webContents.executeJavaScript(`localStorage.setItem('${key}', '${value}')`, true);
  }

  static clear() {
    if (!Storage.hasWindow()) return null;
    return Storage.getWindow().webContents.executeJavaScript(`localStorage.clear()`, true);
  }

  static setWindow(window: BrowserWindow) {
    Storage.window = window
  }

  static hasWindow() {
    return Storage.window !== null
  }

  static getWindow() {
    return Storage.window
  }
}
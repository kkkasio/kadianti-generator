import { app, dialog, ipcMain } from "electron"
import { handleError } from "./ErrorHandler"

export function HandleIpcMessages() {

  ipcMain.handle("get:app:version", (event) => {
    return app.getVersion()
  })

  ipcMain.handle("dialog:folder:open", async (event) => {
    return handleError(event, async () => {
      const result = await dialog.showOpenDialog(null, {
        properties: ['openDirectory']
      })

      return result.filePaths[0]
    })
  })

}
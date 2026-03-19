import { ipcMain, dialog } from 'electron'
import { getDatabase } from '../database/connection.js'
import { getAllNodes, updateNode } from '../database/repositories/nodeRepository.js'
import { IpcChannels } from '../../shared/ipcChannels.js'
import type { NodeUpdatePayload } from '../../shared/types.js'

/**
 * Handlers IPC para operaciones sobre nodos.
 *
 * Patrón: cada handler valida su input, delega en el repositorio
 * y devuelve el resultado. No contiene lógica de negocio compleja.
 *
 * ipcMain.handle → responde a ipcRenderer.invoke (async, con retorno)
 */
export function registerNodeHandlers(): void {
  ipcMain.handle(IpcChannels.nodes.getAll, () => {
    const db = getDatabase()
    return getAllNodes(db)
  })

  ipcMain.handle(
    IpcChannels.nodes.update,
    (_event, id: string, data: NodeUpdatePayload) => {
      const db = getDatabase()
      updateNode(db, id, {
        title: data.title,
        description: data.description,
        imagePath: data.imagePath,
      })
    }
  )

  ipcMain.handle(IpcChannels.dialog.openImage, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }],
    })

    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })
}
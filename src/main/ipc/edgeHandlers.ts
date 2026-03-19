import { ipcMain } from 'electron'
import { getDatabase } from '../database/connection.js'
import { getAllEdges } from '../database/repositories/edgeRepository.js'
import { IpcChannels } from '../../shared/ipcChannels.js'

/**
 * Handlers IPC para edges.
 *
 * Solo lectura. Los edges se cargan para visualización en React Flow.
 * No se expone ningún handler de escritura (decisión de diseño cerrada).
 */
export function registerEdgeHandlers(): void {
  ipcMain.handle(IpcChannels.edges.getAll, () => {
    const db = getDatabase()
    return getAllEdges(db)
  })
}
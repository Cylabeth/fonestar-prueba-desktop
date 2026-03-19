import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannels } from '../shared/ipcChannels.js'
import type { NodeUpdatePayload } from '../shared/types.js'

/**
 * Preload script — único puente entre renderer y main process.
 *
 * Expone window.electronAPI vía contextBridge.
 * Los canales IPC se importan desde shared/ipcChannels para
 * evitar literales duplicados entre procesos.
 *
 * El renderer accede a esta API con tipado completo a través de
 * la declaración global en src/renderer/types/ipc.types.ts.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // ── Nodes ────────────────────────────────────────────────────────────
  getNodes: () =>
    ipcRenderer.invoke(IpcChannels.nodes.getAll),

  updateNode: (id: string, data: NodeUpdatePayload) =>
    ipcRenderer.invoke(IpcChannels.nodes.update, id, data),

  // ── Edges ────────────────────────────────────────────────────────────
  getEdges: () =>
    ipcRenderer.invoke(IpcChannels.edges.getAll),

  // ── Diálogos del sistema ─────────────────────────────────────────────
  openImageDialog: (): Promise<string | null> =>
    ipcRenderer.invoke(IpcChannels.dialog.openImage),
})
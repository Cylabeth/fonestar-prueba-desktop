import { contextBridge, ipcRenderer } from 'electron'
import { IpcChannels } from '../shared/ipcChannels'
import type { NodeUpdatePayload } from '../shared/types'

console.log('[preload] preload script loaded')

contextBridge.exposeInMainWorld('electronAPI', {
  getNodes: () => ipcRenderer.invoke(IpcChannels.nodes.getAll),

  updateNode: (id: string, data: NodeUpdatePayload) =>
    ipcRenderer.invoke(IpcChannels.nodes.update, id, data),

  getEdges: () => ipcRenderer.invoke(IpcChannels.edges.getAll),

  openImageDialog: (): Promise<string | null> =>
    ipcRenderer.invoke(IpcChannels.dialog.openImage),
})
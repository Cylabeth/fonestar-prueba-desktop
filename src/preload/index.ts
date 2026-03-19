import { contextBridge } from 'electron'

/**
 * Preload mínimo — fase de arranque.
 *
 * Solo verifica que el bridge está activo y la ventana
 * puede acceder a window.electronAPI.
 *
 * La API completa (nodes, edges, dialogs) se expone
 * en la fase de IPC, una vez que los handlers estén implementados.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  appName: 'NodeTron',
})
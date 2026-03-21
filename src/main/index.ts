import { app, BrowserWindow } from 'electron'
import { createMainWindow } from './window'
import { initializeDatabase } from './database/connection'
import { initializeSchema } from './database/schema'
import { registerIpcHandlers } from './ipc'
import { registerLocalFileProtocol, handleLocalFileProtocol } from './protocol'

/**
 * Entry point del proceso principal.
 *
 * Toda la inicialización ocurre dentro de app.whenReady()
 * porque app.getPath('userData') requiere que Electron esté listo.
 *
 * Orden deliberado dentro del callback:
 * 1. initializeDatabase() → abre/crea el archivo .db
 * 2. initializeSchema()   → crea tablas y seed si es necesario
 * 3. registerIpcHandlers() → handlers listos antes de que el renderer pida datos
 * 4. createMainWindow()   → la ventana carga React cuando todo lo anterior está listo
 */

/**
 * Debe ejecutarse antes de app.whenReady() por restricción de Electron.
 */
registerLocalFileProtocol()

app.whenReady().then(() => {
  const db = initializeDatabase()
  initializeSchema(db)
  registerIpcHandlers()
  handleLocalFileProtocol()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
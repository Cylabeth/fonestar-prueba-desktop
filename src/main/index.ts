import { app, BrowserWindow } from 'electron'
import { createMainWindow } from './window.js'
import { initializeDatabase } from './database/connection.js'
import { initializeSchema } from './database/schema.js'
import { registerIpcHandlers } from './ipc/index.js'

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
app.whenReady().then(() => {
  const db = initializeDatabase()
  initializeSchema(db)
  registerIpcHandlers()
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
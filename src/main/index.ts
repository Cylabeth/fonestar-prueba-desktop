import { app, BrowserWindow } from 'electron'
import { createMainWindow } from './window.js'

/**
 * Entry point del proceso principal de Electron.
 *
 * Nota sobre imports: con module: NodeNext los imports relativos
 * requieren extensión .js explícita. TypeScript resuelve window.js
 * buscando window.ts en compilación y emite window.js en dist-electron.
 *
 * Responsabilidades de este archivo (intencionalmente limitadas):
 * - Gestionar el ciclo de vida de Electron
 * - Crear la ventana principal cuando la app esté lista
 *
 * SQLite e IPC se inicializan aquí en la siguiente fase.
 */

app.whenReady().then(() => {
  createMainWindow()

  // macOS: reabrir la ventana si se hace clic en el dock
  // y no hay ninguna ventana abierta
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

// Windows / Linux: cerrar la app al cerrar todas las ventanas
// En macOS este comportamiento no aplica por convención de plataforma
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
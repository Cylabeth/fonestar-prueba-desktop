import { BrowserWindow, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Factory de la ventana principal de NodeTron.
 *
 * Seguridad:
 * - contextIsolation: true  → renderer aislado del contexto Node/Electron
 * - nodeIntegration: false  → renderer sin acceso a APIs de Node
 * - preload                 → único puente autorizado vía contextBridge
 *
 * sandbox se activa en una fase posterior una vez que la integración
 * IPC esté estable y verificada.
 */
export function createMainWindow(): BrowserWindow {
  const preloadPath = path.join(__dirname, '../preload/index.js')

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    backgroundColor: '#EEF2FF',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  return win
}
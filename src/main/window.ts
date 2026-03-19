import { BrowserWindow, shell } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * En ESM no existe __dirname de forma nativa.
 * Este patrón permite reconstruirlo a partir de import.meta.url.
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Crea la ventana principal de la aplicación.
 *
 * Responsabilidades:
 * - Configurar BrowserWindow
 * - Definir políticas de seguridad del renderer
 * - Cargar entorno dev (Vite) o build (dist)
 *
 * No incluye lógica de negocio ni IPC → eso va en otras capas.
 */
export function createMainWindow(): BrowserWindow {
  /**
   * Ruta al preload compilado.
   * Importante: apunta a dist-electron, no a src.
   */
  const preloadPath = path.join(__dirname, '../preload/index.js')

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,

    /**
     * Evita el "flash blanco" al arrancar.
     * La ventana se muestra solo cuando React está listo.
     */
    show: false,

    /**
     * Color de fondo alineado con el tema.
     * Reduce el parpadeo visual al iniciar.
     */
    backgroundColor: '#EEF2FF',

    webPreferences: {
      preload: preloadPath,

      /**
       * Aisla el contexto del renderer.
       * Impide acceso directo a APIs de Node/Electron.
       */
      contextIsolation: true,

      /**
       * Desactiva require() en el renderer.
       * Toda comunicación pasa por preload + IPC.
       */
      nodeIntegration: false
    }
  })

  /**
   * Mostrar solo cuando el contenido está listo.
   */
  win.once('ready-to-show', () => {
    win.show()
  })

  /**
   * Entorno de desarrollo:
   * - Carga el servidor Vite (HMR)
   *
   * Producción:
   * - Carga el build estático
   */
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  /**
   * Seguridad:
   * Cualquier intento de abrir nuevas ventanas (target="_blank")
   * se redirige al navegador del sistema.
   */
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  return win
}
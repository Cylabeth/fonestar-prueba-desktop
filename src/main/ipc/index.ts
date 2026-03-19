import { registerNodeHandlers } from './nodeHandlers.js'
import { registerEdgeHandlers } from './edgeHandlers.js'

/**
 * Punto de entrada centralizado para el registro de handlers IPC.
 *
 * src/main/index.ts llama a esta función una sola vez al arrancar.
 * Añadir nuevos dominios es tan simple como importar y llamar
 * su función de registro aquí.
 */
export function registerIpcHandlers(): void {
  registerNodeHandlers()
  registerEdgeHandlers()
}
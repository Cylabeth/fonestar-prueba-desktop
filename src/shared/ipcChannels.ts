/**
 * Canales IPC centralizados.
 *
 * Única fuente de verdad para los nombres de canales entre
 * main process y renderer. Evita literales duplicados y
 * errores de typo difíciles de detectar en runtime.
 *
 * Importado por:
 * - src/main/ipc/nodeHandlers.ts
 * - src/main/ipc/edgeHandlers.ts
 * - src/preload/index.ts (fase siguiente)
 */
export const IpcChannels = {
  nodes: {
    getAll: 'nodes:getAll',
    update: 'nodes:update',
  },
  edges: {
    getAll: 'edges:getAll',
  },
  dialog: {
    openImage: 'dialog:openImage',
  },
} as const
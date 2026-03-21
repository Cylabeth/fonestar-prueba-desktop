import { protocol, net } from 'electron'

/**
 * Registra el esquema 'localfile' como privilegiado.
 *
 * DEBE llamarse antes de app.whenReady() — restricción de Electron.
 * registerSchemesAsPrivileged solo tiene efecto antes de que
 * la app esté lista.
 */
export function registerLocalFileProtocol(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'localfile',
      privileges: {
        secure: true,
        supportFetchAPI: true,
        bypassCSP: true,
      },
    },
  ])
}

/**
 * Registra el handler del protocolo 'localfile'.
 *
 * Debe llamarse dentro de app.whenReady().
 * Convierte localfile:///ruta → file:///ruta y sirve el archivo
 * al renderer de forma segura sin exponer file:// directamente.
 */
export function handleLocalFileProtocol(): void {
  protocol.handle('localfile', (request) => {
    const filePath = request.url.replace('localfile://', 'file://')
    return net.fetch(filePath)
  })
}
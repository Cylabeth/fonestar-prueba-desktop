/**
 * Convierte una ruta absoluta del sistema de archivos
 * al protocolo personalizado 'localfile://' que Electron
 * puede servir de forma segura al renderer.
 *
 * Windows: C:\Users\beth\photo.jpg → localfile:///C:/Users/beth/photo.jpg
 * macOS/Linux: /home/beth/photo.jpg → localfile:///home/beth/photo.jpg
 *
 * Se usa en cualquier componente que muestre imágenes locales.
 */
export function toLocalFileUrl(filePath: string): string {
  if (!filePath) return ''

  // Normaliza separadores Windows → Unix
  const normalized = filePath.replace(/\\/g, '/')

  // Evita doble prefijo si ya viene procesada
  if (normalized.startsWith('localfile://')) return normalized

  // Windows: "C:/ruta" necesita una barra extra → localfile:///C:/ruta
  // Unix: "/ruta" → localfile:////ruta quedaría mal, ajustamos
  const withSlash = normalized.startsWith('/')
    ? normalized
    : `/${normalized}`

  return `localfile://${withSlash}`
}
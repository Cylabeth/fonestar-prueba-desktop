/**
 * Tipos de dominio compartidos entre main y renderer.
 *
 * Convención: camelCase en TypeScript, snake_case en SQLite.
 * El mapeo entre ambas convenciones ocurre en los repositorios.
 */

export interface NodeRecord {
  id: string
  title: string
  description: string
  imagePath: string
  posX: number
  posY: number
}

export interface EdgeRecord {
  id: string
  source: string
  target: string
  label?: string
}

export interface NodeUpdatePayload {
  title: string
  description: string
  imagePath: string
}
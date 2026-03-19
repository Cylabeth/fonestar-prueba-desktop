import type Database from 'better-sqlite3'
import type { EdgeRecord } from '../../../shared/types.js'

/**
 * Repositorio de edges — solo lectura.
 *
 * Los edges se cargan para visualización en React Flow.
 * La edición de conexiones está fuera del scope de esta prueba.
 */
export function getAllEdges(db: Database.Database): EdgeRecord[] {
  return db.prepare('SELECT * FROM edges').all() as EdgeRecord[]
}
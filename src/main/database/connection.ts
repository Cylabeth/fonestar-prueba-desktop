import Database from 'better-sqlite3'
import path from 'node:path'
import { app } from 'electron'

/**
 * Singleton de la conexión SQLite.
 *
 * Se inicializa una sola vez al arrancar el main process.
 * Toda la capa de repositorios consume esta instancia.
 *
 * Ubicación del archivo .db:
 * - Desarrollo y producción: directorio de datos de la app (app.getPath('userData'))
 * - Esto garantiza que el archivo persiste entre reinicios y
 *   no queda dentro del bundle de la aplicación.
 */

let db: Database.Database | null = null

export function initializeDatabase(): Database.Database {
  if (db) return db

  const dbPath = path.join(app.getPath('userData'), 'nodetron.db')

  db = new Database(dbPath)

  // WAL mode: mejora el rendimiento en lecturas concurrentes
  // y reduce bloqueos en escrituras
  db.pragma('journal_mode = WAL')

  return db
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error(
      'Database not initialized. Call initializeDatabase() first.'
    )
  }
  return db
}
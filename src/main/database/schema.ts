import type Database from 'better-sqlite3'

/**
 * Define el esquema de la base de datos y ejecuta el seed inicial.
 *
 * Se ejecuta una sola vez al arrancar si las tablas no existen.
 * El uso de CREATE TABLE IF NOT EXISTS garantiza idempotencia:
 * se puede llamar en cada arranque sin riesgo de pérdida de datos.
 */
export function initializeSchema(db: Database.Database): void {
  createTables(db)
  seedIfEmpty(db)
}

function createTables(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS nodes (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image_path  TEXT NOT NULL DEFAULT '',
      pos_x       REAL NOT NULL DEFAULT 0,
      pos_y       REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS edges (
      id      TEXT PRIMARY KEY,
      source  TEXT NOT NULL,
      target  TEXT NOT NULL,
      label   TEXT
    );
  `)
}

function seedIfEmpty(db: Database.Database): void {
  const count = (
    db.prepare('SELECT COUNT(*) as count FROM nodes').get() as { count: number }
  ).count

  // Solo insertar si la tabla está vacía
  // Evita duplicar el seed en cada reinicio de la app
  if (count > 0) return

  const insertNode = db.prepare(`
    INSERT INTO nodes (id, title, description, image_path, pos_x, pos_y)
    VALUES (@id, @title, @description, @image_path, @pos_x, @pos_y)
  `)

  const insertEdge = db.prepare(`
    INSERT INTO edges (id, source, target, label)
    VALUES (@id, @source, @target, @label)
  `)

  // Transacción: el seed es atómico, o entra todo o no entra nada
  const runSeed = db.transaction(() => {
    insertNode.run({
      id: 'node-1',
      title: 'Project Start',
      description: 'Initial phase of the project.',
      image_path: '',
      pos_x: 80,
      pos_y: 200,
    })
    insertNode.run({
      id: 'node-2',
      title: 'Research',
      description: 'Data gathering and analysis.',
      image_path: '',
      pos_x: 300,
      pos_y: 100,
    })
    insertNode.run({
      id: 'node-3',
      title: 'Design',
      description: 'UI/UX and architecture design.',
      image_path: '',
      pos_x: 300,
      pos_y: 300,
    })
    insertNode.run({
      id: 'node-4',
      title: 'Development',
      description: 'Implementation of core features.',
      image_path: '',
      pos_x: 540,
      pos_y: 100,
    })
    insertNode.run({
      id: 'node-5',
      title: 'Deployment',
      description: 'Release and production setup.',
      image_path: '',
      pos_x: 540,
      pos_y: 300,
    })

    insertEdge.run({ id: 'edge-1', source: 'node-1', target: 'node-2', label: null })
    insertEdge.run({ id: 'edge-2', source: 'node-1', target: 'node-3', label: null })
    insertEdge.run({ id: 'edge-3', source: 'node-2', target: 'node-4', label: 'builds on' })
    insertEdge.run({ id: 'edge-4', source: 'node-3', target: 'node-5', label: null })
  })

  runSeed()
}
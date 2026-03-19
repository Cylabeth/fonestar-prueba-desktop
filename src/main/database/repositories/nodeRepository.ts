import type Database from 'better-sqlite3'
import type { NodeRecord, NodeUpdatePayload } from '../../../shared/types.js'

/**
 * Repositorio de nodos.
 *
 * Mapeo de convenciones:
 * - SQLite usa snake_case (image_path, pos_x, pos_y)
 * - TypeScript usa camelCase (imagePath, posX, posY)
 *
 * El mapeo se resuelve con alias SQL en el SELECT,
 * manteniendo la lógica de transformación en un único lugar.
 */

const SELECT_ALL = `
  SELECT
    id,
    title,
    description,
    image_path  AS imagePath,
    pos_x       AS posX,
    pos_y       AS posY
  FROM nodes
`

export function getAllNodes(db: Database.Database): NodeRecord[] {
  return db.prepare(SELECT_ALL).all() as NodeRecord[]
}

export function updateNode(
  db: Database.Database,
  id: string,
  data: NodeUpdatePayload
): void {
  db.prepare(`
    UPDATE nodes
    SET title       = @title,
        description = @description,
        image_path  = @imagePath
    WHERE id = @id
  `).run({ ...data, id })
}
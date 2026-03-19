// export {} convierte este archivo en módulo ES.
// Sin esto, declare global se aplica al scope de script global
// y puede causar conflictos o comportamiento inesperado.
export {}

import type { NodeRecord, EdgeRecord, NodeUpdatePayload } from '@shared/types'

declare global {
  interface Window {
    electronAPI: {
      getNodes: () => Promise<NodeRecord[]>
      updateNode: (id: string, data: NodeUpdatePayload) => Promise<void>
      getEdges: () => Promise<EdgeRecord[]>
      openImageDialog: () => Promise<string | null>
    }
  }
}

export type { NodeRecord, EdgeRecord, NodeUpdatePayload }
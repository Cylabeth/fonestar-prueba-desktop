import { useState, useCallback, useEffect } from 'react'
import type { NodeRecord, EdgeRecord } from '@/types/ipc.types'

interface UseNodesResult {
  nodes: NodeRecord[]
  edges: EdgeRecord[]
  isLoading: boolean
  error: string | null
  reload: () => void
}

export function useNodes(): UseNodesResult {
  const [nodes, setNodes] = useState<NodeRecord[]>([])
  const [edges, setEdges] = useState<EdgeRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // En navegador normal (localhost) no existe el bridge de Electron.
      if (!window.electronAPI) {
        setError('Desktop features are only available inside the Electron app.')
        setNodes([])
        setEdges([])
        return
      }

      const [fetchedNodes, fetchedEdges] = await Promise.all([
        window.electronAPI.getNodes(),
        window.electronAPI.getEdges(),
      ])

      setNodes(fetchedNodes)
      setEdges(fetchedEdges)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return { nodes, edges, isLoading, error, reload: fetchData }
}
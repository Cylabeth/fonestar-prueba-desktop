import { useState, useCallback } from 'react'
import type { NodeRecord, NodeUpdatePayload } from '@/types/ipc.types'

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

interface UseNodeEditorResult {
  selectedNode: NodeRecord | null
  formData: NodeUpdatePayload
  saveStatus: SaveStatus
  selectNode: (node: NodeRecord) => void
  clearSelection: () => void
  updateField: <K extends keyof NodeUpdatePayload>(key: K, value: NodeUpdatePayload[K]) => void
  saveChanges: () => Promise<void>
  resetSaveStatus: () => void
}

export function useNodeEditor(onSaveSuccess?: () => void): UseNodeEditorResult {
  const [selectedNode, setSelectedNode] = useState<NodeRecord | null>(null)
  const [formData, setFormData] = useState<NodeUpdatePayload>({
    title: '',
    description: '',
    imagePath: '',
  })
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  const selectNode = useCallback((node: NodeRecord) => {
    setSelectedNode(node)
    setFormData({
      title: node.title,
      description: node.description,
      imagePath: node.imagePath,
    })
    setSaveStatus('idle')
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedNode(null)
    setFormData({ title: '', description: '', imagePath: '' })
    setSaveStatus('idle')
  }, [])

  const updateField = useCallback(
    <K extends keyof NodeUpdatePayload>(key: K, value: NodeUpdatePayload[K]) => {
      setFormData(prev => ({ ...prev, [key]: value }))
    },
    []
  )

  const saveChanges = useCallback(async () => {
    if (!selectedNode) return

    setSaveStatus('saving')

    try {
      await window.electronAPI.updateNode(selectedNode.id, formData)
      setSaveStatus('success')
      onSaveSuccess?.()
    } catch {
      setSaveStatus('error')
    }
  }, [selectedNode, formData, onSaveSuccess])

  // Permite al consumidor volver a idle después de mostrar el Snackbar
  const resetSaveStatus = useCallback(() => {
    setSaveStatus('idle')
  }, [])

  return {
    selectedNode,
    formData,
    saveStatus,
    selectNode,
    clearSelection,
    updateField,
    saveChanges,
    resetSaveStatus,
  }
}
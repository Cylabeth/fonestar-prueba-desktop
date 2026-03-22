import { useCallback, useMemo, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CustomNode } from './CustomNode'
import type { NodeRecord, EdgeRecord } from '@/types/ipc.types'

const nodeTypes = { custom: CustomNode }

interface DiagramCanvasProps {
  nodeRecords: NodeRecord[]
  edgeRecords: EdgeRecord[]
  isLoading: boolean
  error: string | null
  onNodeSelect: (node: NodeRecord) => void
}

function toFlowNodes(records: NodeRecord[]): Node<NodeRecord>[] {
  return records.map(record => ({
    id: record.id,
    type: 'custom',
    position: { x: record.posX, y: record.posY },
    data: record,
  }))
}

function toFlowEdges(records: EdgeRecord[]): Edge[] {
  return records.map(record => ({
    id: record.id,
    source: record.source,
    target: record.target,
    label: record.label,
    type: 'smoothstep',
    style: {
      stroke: '#a0aabf',
      strokeWidth: 1.5,
      opacity: 0.7,
    },
    labelStyle: {
      fontSize: 11,
      fill: '#8892b0',
      opacity: 0.8,
    },
    labelBgStyle: {
      fill: 'rgba(238,242,255,0.75)',
      stroke: 'none',
    },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 4,
  }))
}

export default function DiagramCanvas({
  nodeRecords,
  edgeRecords,
  isLoading,
  error,
  onNodeSelect,
}: DiagramCanvasProps) {
  const theme = useTheme()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const flowNodes = useMemo(() => toFlowNodes(nodeRecords), [nodeRecords])
  const flowEdges = useMemo(() => toFlowEdges(edgeRecords), [edgeRecords])

  useEffect(() => {
    setNodes(flowNodes)
  }, [flowNodes, setNodes])

  useEffect(() => {
    setEdges(flowEdges)
  }, [flowEdges, setEdges])

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeSelect(node.data as NodeRecord)
    },
    [onNodeSelect]
  )

  if (isLoading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        '& .react-flow__minimap': {
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(79,111,232,0.15)',
          opacity: 0.92,
        },
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={theme.palette.mode === 'dark' ? '#2a3550' : '#c8d0e8'}
        />
        <Controls />
        <MiniMap
          nodeColor={() =>
            theme.palette.mode === 'dark' ? '#4F6FE8' : '#6C8FFF'
          }
          maskColor={
            theme.palette.mode === 'dark'
              ? 'rgba(13,17,23,0.7)'
              : 'rgba(238,242,255,0.7)'
          }
        />
      </ReactFlow>
    </Box>
  )
}

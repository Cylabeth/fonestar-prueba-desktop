import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Box, Typography } from '@mui/material'
import type { NodeRecord } from '@/types/ipc.types'
import { toLocalFileUrl } from '@/services/electronApi'

// ── Paleta de colores de nodos ────────────────────────────────────────────────
// Cada entrada define el color base, su versión intensa para el círculo
// placeholder, y el gradiente de fondo del área superior.
import { NODE_COLORS, getNodeColor } from './nodeColors'

export const CustomNode = memo(function CustomNode({
  data,
  selected,
}: NodeProps<NodeRecord>) {
  const colorKey = getNodeColor(data.id)
  const color = NODE_COLORS[colorKey]

  return (
    <Box
      sx={{
        width: 120,
        borderRadius: 2,
        border: selected
          ? `2px solid ${color.base}`
          : '1.5px solid rgba(255,255,255,0.6)',
        bgcolor: 'background.paper',
        // Glow suavizado: sombra leve en lugar de halo intenso
        boxShadow: selected
          ? `0 0 0 3px ${color.base}22, 0 4px 16px rgba(0,0,0,0.12)`
          : '0 2px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {data.imagePath ? (
        <Box
          component="img"
          src={toLocalFileUrl(data.imagePath)}
          alt={data.title}
          sx={{
            width: '100%',
            height: 70,
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: 70,
            background: color.gradient,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: `1px solid ${color.base}33`,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: color.intense,
              opacity: 0.70,
              boxShadow: `0 4px 6px ${color.intense}60`,
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          px: 1,
          py: 0.75,
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body2"
          fontWeight={700}
          color="text.primary"
          noWrap
          fontSize="0.78rem"
        >
          {data.title}
        </Typography>
      </Box>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Box>
  )
})
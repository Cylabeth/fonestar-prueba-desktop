import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
  useTheme,
} from '@mui/material'
import type { NodeUpdatePayload } from '@/types/ipc.types'
import ImagePicker from './ImagePicker'

interface NodeSidebarProps {
  formData: NodeUpdatePayload
  isSaving: boolean
  onFieldChange: <K extends keyof NodeUpdatePayload>(
    key: K,
    value: NodeUpdatePayload[K]
  ) => void
  onSave: () => void
}

/**
 * Panel lateral de edición de propiedades de un nodo.
 *
 * Recibe datos y callbacks del hook useNodeEditor.
 * No gestiona estado propio — es un componente presentacional puro.
 */
export default function NodeSidebar({
  formData,
  isSaving,
  onFieldChange,
  onSave,
}: NodeSidebarProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: 280,
        height: '100%',
        borderLeft: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" fontSize="0.95rem">
          Node Properties
        </Typography>
      </Box>

      {/* Campos */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2.5,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* Title */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
            Title
          </Typography>
          <TextField
            fullWidth
            value={formData.title}
            onChange={e => onFieldChange('title', e.target.value)}
          />
        </Box>

        <Divider />

        {/* Image picker */}
        <ImagePicker
          imagePath={formData.imagePath}
          onChange={path => onFieldChange('imagePath', path)}
        />

        <Divider />

        {/* Description */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Edit description…"
            value={formData.description}
            onChange={e => onFieldChange('description', e.target.value)}
          />
        </Box>
      </Box>

      {/* Footer con botón guardar */}
        <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
            variant="contained"
            fullWidth
            onClick={onSave}
            disabled={isSaving}
            sx={{
            py: 1.5,
            fontSize: '0.98rem',
            fontWeight: 400,
            borderRadius: 0.75,
            background: 'linear-gradient(135deg, #4F6FE8 0%, #6C8FFF 100%)',
            boxShadow: '0 4px 14px rgba(79,111,232,0.35)',
            '&:hover': {
                background: 'linear-gradient(135deg, #3D5FD9 0%, #5A7FFF 100%)',
            },
            }}
        >
            {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save changes'}
        </Button>
        </Box>
    </Box>
  )
}
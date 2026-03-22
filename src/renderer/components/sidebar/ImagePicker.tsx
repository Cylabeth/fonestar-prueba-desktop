import { Box, Button, Typography, IconButton, useTheme } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { toLocalFileUrl } from '@/services/electronApi'

interface ImagePickerProps {
  imagePath: string
  onChange: (path: string) => void
}

export default function ImagePicker({ imagePath, onChange }: ImagePickerProps) {
  const theme = useTheme()

  async function handlePick() {
    const path = await window.electronAPI.openImageDialog()
    if (path) onChange(path)
  }

  function handleRemove() {
    onChange('')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Image
      </Typography>

      {/* Preview */}
      <Box
        sx={{
          width: '100%',
          height: 120,
          borderRadius: 2,
          border: `1.5px dashed ${theme.palette.divider}`,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.mode === 'dark' ? '#1e2a3a' : '#f0f4ff',
        }}
      >
        {imagePath ? (
          <>
            <Box
              component="img"
              src={toLocalFileUrl(imagePath)}
              alt="Node image preview"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Botón eliminar — esquina superior derecha */}
            <IconButton
              size="small"
              onClick={handleRemove}
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                bgcolor: 'rgba(0,0,0,0.45)',
                color: '#fff',
                '&:hover': {
                  bgcolor: 'rgba(200,40,40,0.8)',
                },
                width: 26,
                height: 26,
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        ) : (
          <Typography variant="caption" color="text.disabled">
            No image selected
          </Typography>
        )}
      </Box>

      <Button
        variant="outlined"
        size="small"
        startIcon={<UploadFileIcon />}
        onClick={handlePick}
        fullWidth
      >
        Upload
      </Button>
    </Box>
  )
}
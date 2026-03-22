import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useTheme } from '@mui/material/styles'

interface ProfileModalProps {
  open: boolean
  onClose: () => void
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const theme = useTheme()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', pb: 1 }}>
        My Profile
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {/* Avatar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 3,
            gap: 1.5,
          }}
        >
          <Avatar
            src="/avatar_logo.png"
            alt="Admin"
            sx={{ width: 88, height: 88 }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              admin@nodetron.local
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Email */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              value="admin@nodetron.local"
              disabled
              size="small"
            />
          </Box>

          {/* Password con toggle de visibilidad */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
              Password
            </Typography>
            <TextField
              fullWidth
              value="Admin123!"
              disabled
              size="small"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(prev => !prev)}
                      edge="end"
                    >
                      {showPassword
                        ? <VisibilityOffIcon fontSize="small" />
                        : <VisibilityIcon fontSize="small" />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Nota */}
          <Box
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#1a2340' : '#f0f4ff',
              borderRadius: 2,
              px: 2,
              py: 1.25,
            }}
          >
            <Typography variant="caption" color="text.secondary" lineHeight={1.6}>
              Profile editing — including avatar, email and password — will be
              available in a future release when the authentication system is
              fully implemented.
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled
            sx={{ mt: 0.5, py: 1.25 }}
          >
            Save changes
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
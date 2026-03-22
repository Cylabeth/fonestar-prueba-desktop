import { useState, type FormEvent } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useTheme } from '@mui/material/styles'
import ThemeToggle from '@/components/ThemeToggle'

const VALID_EMAIL = 'admin@nodetron.local'
const VALID_PASSWORD = 'Admin123!'

interface LoginPageProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  onLogin: () => void
}

export default function LoginPage({
  isDarkMode,
  onToggleTheme,
  onLogin,
}: LoginPageProps) {
  const theme = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        onLogin()
      } else {
        setError('Invalid email or password.')
        setIsLoading(false)
      }
    }, 400)
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0.75,
      bgcolor: isDarkMode ? '#1e2a3a' : '#f4f6fb',
      fontSize: '0.95rem',
    },
    '& input::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.45,
      fontSize: '0.95rem',
    },
    '& .MuiOutlinedInput-input': {
      py: 1.5,
    },
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isDarkMode ? '#0d1117' : '#e8ecf8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Banda inferior */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          bgcolor: isDarkMode ? '#161b27' : '#d0d8f0',
          opacity: 0.6,
        }}
      />

      {/* Branding */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1.5,
          mb: 3,
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          src="/logo.svg"
          alt="NodeTron"
          sx={{ width: 48, height: 48, flexShrink: 0 }}
        />
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 500,
            color: theme.palette.text.primary,
            letterSpacing: '-0.5px',
          }}
        >
          NodeTron
        </Typography>
      </Box>

      {/* Card */}
      <Card
        elevation={isDarkMode ? 4 : 2}
        sx={{
          width: 550,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: isDarkMode
            ? '0 8px 40px rgba(0,0,0,0.6)'
            : '0 8px 40px rgba(79,111,232,0.10)',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ px: 4, pt: 4, pb: '32px !important' }}>

          {/* Header: Sign in + toggle */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '1.6rem',
                fontWeight: 400,
                color: theme.palette.text.primary,
                letterSpacing: '-0.3px',
              }}
            >
              Sign in
            </Typography>
            <ThemeToggle checked={isDarkMode} onChange={onToggleTheme} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
          >
            {/* Email */}
            <Box>
              <Typography
                sx={{ mb: 0.75, fontWeight: 500, fontSize: '0.95rem', color: theme.palette.text.secondary }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                sx={inputSx}
              />
            </Box>

            {/* Password */}
            <Box>
              <Typography
                sx={{ mb: 0.75, fontWeight: 500, fontSize: '0.95rem', color: theme.palette.text.secondary }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                sx={inputSx}
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

            {error && (
              <Alert severity="error" sx={{ py: 0.5, borderRadius: 1.5 }}>
                {error}
              </Alert>
            )}

            {/* Botón Login */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 300,
                letterSpacing: '0.8px',
                borderRadius: 0.75,
                background: 'linear-gradient(135deg, #4F6FE8 0%, #6C8FFF 100%)',
                boxShadow: '0 4px 14px rgba(79,111,232,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3D5FD9 0%, #5A7FFF 100%)',
                },
              }}
            >
              {isLoading ? 'Signing in…' : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
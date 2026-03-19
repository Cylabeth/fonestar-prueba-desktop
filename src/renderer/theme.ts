import { createTheme, type Theme } from '@mui/material/styles'

/**
 * Tokens de diseño extraídos del mockup:
 *
 * Light: fondo #EEF2FF (azul-gris muy suave), card blanca, texto #1a2340
 * Dark:  fondo #0d1117 (negro-azul), card #161b27, texto #e8eaf6
 * Primario: #4F6FE8 con gradiente hacia #6C8FFF en acciones
 */

const shared = {
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none' as const, fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #4F6FE8 0%, #6C8FFF 100%)',
          boxShadow: '0 4px 14px rgba(79, 111, 232, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3D5FD9 0%, #5A7FFF 100%)',
            boxShadow: '0 6px 20px rgba(79, 111, 232, 0.5)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' as const },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
}

export const lightTheme: Theme = createTheme({
  ...shared,
  palette: {
    mode: 'light',
    primary: { main: '#4F6FE8' },
    background: {
      default: '#EEF2FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1a2340',
      secondary: '#5c6780',
    },
  },
})

export const darkTheme: Theme = createTheme({
  ...shared,
  palette: {
    mode: 'dark',
    primary: { main: '#6C8FFF' },
    background: {
      default: '#0d1117',
      paper: '#161b27',
    },
    text: {
      primary: '#e8eaf6',
      secondary: '#8892b0',
    },
  },
})
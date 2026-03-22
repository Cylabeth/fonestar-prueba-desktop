import { Box } from '@mui/material'

interface ThemeToggleProps {
  checked: boolean
  onChange: () => void
}

/**
 * Toggle de tema light/dark con estilo personalizado.
 * Track gris-azulado, círculo amarillo dorado.
 * Reutilizado en LoginPage y MainPage.
 */
export default function ThemeToggle({ checked, onChange }: ThemeToggleProps) {
  return (
    <Box
      onClick={onChange}
      sx={{
        width: 48,
        height: 26,
        borderRadius: 99,
        bgcolor: checked ? '#2a3550' : '#c8d0e8',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: '#F6C85F',
          boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
          position: 'absolute',
          top: '50%',
          transform: checked
            ? 'translate(24px, -50%)'
            : 'translate(4px, -50%)',
          transition: 'transform 0.3s ease',
        }}
      />
    </Box>
  )
}
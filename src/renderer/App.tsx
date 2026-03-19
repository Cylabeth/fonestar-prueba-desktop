import { useState, useCallback } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { lightTheme, darkTheme } from './theme'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'

/**
 * Raíz de la aplicación React.
 *
 * Gestiona dos estados de nivel de app:
 * - isDarkMode: tema visual (persiste preferencia del usuario)
 * - isAuthenticated: controla qué página se muestra
 *
 * No se usa router externo porque la navegación se reduce
 * a dos estados mutuamente excluyentes. Añadir react-router
 * en este punto sería sobrearquitectura para el scope actual.
 */
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev)
  }, [])

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true)
  }, [])

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false)
  }, [])

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {isAuthenticated ? (
        <MainPage
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onLogout={handleLogout}
        />
      ) : (
        <LoginPage
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onLogin={handleLogin}
        />
      )}
    </ThemeProvider>
  )
}
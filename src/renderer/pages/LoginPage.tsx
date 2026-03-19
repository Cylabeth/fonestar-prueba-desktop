import { Box, Typography } from '@mui/material'

interface LoginPageProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  onLogin: () => void
}

export default function LoginPage(props: LoginPageProps) {
  void props

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Login Page</Typography>
    </Box>
  )
}
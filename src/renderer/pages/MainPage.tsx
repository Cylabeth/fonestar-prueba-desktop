import { Box, Typography } from '@mui/material'

interface MainPageProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  onLogout: () => void
}

export default function MainPage(props: MainPageProps) {
  void props

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Main Page</Typography>
    </Box>
  )
}
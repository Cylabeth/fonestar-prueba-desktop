import { useCallback, useState } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '@mui/material/styles'
import { useNodes } from '@/hooks/useNodes'
import { useNodeEditor } from '@/hooks/useNodeEditor'
import DiagramCanvas from '@/components/diagram/DiagramCanvas'
import NodeSidebar from '@/components/sidebar/NodeSidebar'
import ProfileModal from '@/components/ProfileModal'
import type { NodeRecord } from '@/types/ipc.types'
import ThemeToggle from '@/components/ThemeToggle'


interface MainPageProps {
  isDarkMode: boolean
  onToggleTheme: () => void
  onLogout: () => void
}

export default function MainPage({ isDarkMode, onToggleTheme, onLogout }: MainPageProps) {
  const theme = useTheme()
  const { nodes, edges, isLoading, error, reload } = useNodes()

  const {
    selectedNode,
    formData,
    saveStatus,
    selectNode,
    updateField,
    saveChanges,
    resetSaveStatus,
  } = useNodeEditor(reload)

  // ── Avatar dropdown ───────────────────────────────────────
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(menuAnchor)

  const handleAvatarClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget)
  }, [])

  const handleMenuClose = useCallback(() => {
    setMenuAnchor(null)
  }, [])

  // ── Profile modal ─────────────────────────────────────────
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleOpenProfile = useCallback(() => {
    handleMenuClose()
    setIsProfileOpen(true)
  }, [handleMenuClose])

  const handleCloseProfile = useCallback(() => {
    setIsProfileOpen(false)
  }, [])

  // ── Node selection ────────────────────────────────────────
  const handleNodeSelect = useCallback(
    (node: NodeRecord) => selectNode(node),
    [selectNode]
  )

  const handleLogout = useCallback(() => {
    handleMenuClose()
    onLogout()
  }, [handleMenuClose, onLogout])

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: '60px !important' }}>
          {/* Logo */}
            <Box
                component="img"
                src="/logo.svg"
                alt="NodeTron"
                sx={{ width: 38, height: 38, flexShrink: 0 }}
            />
            <Typography
                variant="h6"
                fontSize="1.1rem"
                fontWeight={700}
                color="text.primary"
                sx={{ flexGrow: 1, letterSpacing: '-0.3px' }}
            >
                NodeTron
            </Typography>

          {/* Toggle tema */}
          <ThemeToggle checked={isDarkMode} onChange={onToggleTheme} />


          {/* Avatar con dropdown */}
            <IconButton onClick={handleAvatarClick} size="small" sx={{ p: 0.25 }}>
                <Avatar
                src="/avatar_logo.png"
                alt="Admin"
                sx={{ width: 50, height: 50 }}
                />
            </IconButton>

          {/* Dropdown menu */}
          <Menu
            anchorEl={menuAnchor}
            open={isMenuOpen}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 0.75,
                minWidth: 160,
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0,0,0,0.5)'
                  : '0 8px 32px rgba(79,111,232,0.12)',
              },
            }}
          >
            <MenuItem onClick={handleOpenProfile} sx={{ gap: 1.5, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 'unset' }}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">My Profile</Typography>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 'unset' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Toolbar de acciones ───────────────────────────────── */}
      <Box
        sx={{
          px: 2,
          //py: 1.25,
          display: 'flex',
          alignItems: 'center',
          bgcolor: theme.palette.background.default,
          position: 'relative',
        }}
      >
        <Button
        variant="contained"
        startIcon={<AddIcon />}
        size="small"
        sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 20,
            px: 2,
            py: 1,
            fontSize: '0.875rem',
            fontWeight: 400,
            borderRadius: 0.75,
            background: 'linear-gradient(135deg, #4F6FE8 0%, #6C8FFF 100%)',
            boxShadow: '0 4px 14px rgba(79,111,232,0.35)',
            '&:hover': {
            background: 'linear-gradient(135deg, #3D5FD9 0%, #5A7FFF 100%)',
            },
        }}
        >
        Add Node
        </Button>
      </Box>

      {/* ── Canvas + sidebar ─────────────────────────────────── */}
      <Box sx={{ flex: 1, height: 0, display: 'flex', overflow: 'hidden', alignItems: 'stretch' }}>
        <DiagramCanvas
          nodeRecords={nodes}
          edgeRecords={edges}
          isLoading={isLoading}
          error={error}
          onNodeSelect={handleNodeSelect}
        />

        {selectedNode && (
          <NodeSidebar
            formData={formData}
            isSaving={saveStatus === 'saving'}
            onFieldChange={updateField}
            onSave={saveChanges}
          />
        )}
      </Box>

      {/* ── Snackbars ────────────────────────────────────────── */}
      <Snackbar
        open={saveStatus === 'success'}
        autoHideDuration={3000}
        onClose={resetSaveStatus}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={resetSaveStatus} sx={{ width: '100%' }}>
          Changes saved successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={saveStatus === 'error'}
        autoHideDuration={4000}
        onClose={resetSaveStatus}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={resetSaveStatus} sx={{ width: '100%' }}>
          Failed to save changes. Please try again.
        </Alert>
      </Snackbar>

      {/* ── Profile modal ─────────────────────────────────────── */}
      <ProfileModal
        open={isProfileOpen}
        onClose={handleCloseProfile}
      />
    </Box>
  )
}
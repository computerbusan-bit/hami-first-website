import Box from '@mui/material/Box'
import BottomNav from './BottomNav'

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        maxWidth: 480,
        mx: 'auto',
        minHeight: '100dvh',
        bgcolor: 'background.default',
        position: 'relative',
        pb: 8,
      }}
    >
      <Box component="main" sx={{ minHeight: 'calc(100dvh - 64px)' }}>
        {children}
      </Box>
      <BottomNav />
    </Box>
  )
}

export default Layout

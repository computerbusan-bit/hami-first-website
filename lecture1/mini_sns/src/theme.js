import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0077B6',
      light: '#0096C7',
      dark: '#023E8A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F48C06',
      light: '#FCBF49',
      dark: '#E85D04',
      contrastText: '#ffffff',
    },
    background: {
      default: '#EEF6FB',
      paper: '#FFFFFF',
    },
    success: {
      main: '#06A77D',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.6rem', fontWeight: 700 },
    h3: { fontSize: '1.3rem', fontWeight: 600 },
    h4: { fontSize: '1.15rem', fontWeight: 600 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.9rem', fontWeight: 600 },
    body1: { fontSize: '0.95rem', lineHeight: 1.6 },
    body2: { fontSize: '0.85rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem' },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(0, 119, 182, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
        },
      },
    },
  },
})

export default theme

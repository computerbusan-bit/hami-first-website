import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e676',
      light: '#69f0ae',
      dark: '#00c853',
      contrastText: '#000000',
    },
    background: {
      default: '#0a0a0a',
      paper: '#141414',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#777777',
    },
    divider: 'rgba(255,255,255,0.07)',
    error: { main: '#f44336' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700, lineHeight: 1.3 },
    h6: { fontWeight: 700, lineHeight: 1.4 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
  },
  spacing: 8,
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#0a0a0a', color: '#f0f0f0' },
        '#root': { minHeight: '100vh' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.01em',
          borderRadius: 6,
        },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: '#141414' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.06)', padding: '12px 16px' },
        head: { backgroundColor: '#0f0f0f', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.03em' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:last-child td': { borderBottom: 0 } },
      },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' } },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 2 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.25) !important' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: '#666' },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.07)' },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: { '& .MuiPaginationItem-root': { borderRadius: 4 } },
      },
    },
  },
});

export default theme;

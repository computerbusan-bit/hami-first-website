import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import MainPage from './pages/MainPage'
import PlacesPage from './pages/PlacesPage'
import PlaceDetailPage from './pages/PlaceDetailPage'
import StampPage from './pages/StampPage'
import MyPage from './pages/MyPage'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    )
  }
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout><MainPage /></Layout></ProtectedRoute>} />
      <Route path="/places" element={<ProtectedRoute><Layout><PlacesPage /></Layout></ProtectedRoute>} />
      <Route path="/places/:id" element={<ProtectedRoute><Layout><PlaceDetailPage /></Layout></ProtectedRoute>} />
      <Route path="/stamp" element={<ProtectedRoute><Layout><StampPage /></Layout></ProtectedRoute>} />
      <Route path="/my" element={<ProtectedRoute><Layout><MyPage /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App = () => (
  <HashRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </HashRouter>
)

export default App

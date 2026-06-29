import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'

const LoginPage = () => {
  const [tab, setTab] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (tab === 0) {
      const { error } = await signIn(email, password)
      if (error) setMessage({ type: 'error', text: '이메일 또는 비밀번호를 확인해주세요.' })
    } else {
      if (!username.trim()) {
        setMessage({ type: 'error', text: '닉네임을 입력해주세요.' })
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, username)
      if (error) {
        setMessage({ type: 'error', text: error.message.includes('already') ? '이미 사용 중인 이메일입니다.' : '회원가입에 실패했습니다.' })
      } else {
        setMessage({ type: 'success', text: '회원가입 완료! 이메일 인증 후 로그인해주세요.' })
      }
    }
    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #023E8A 0%, #0077B6 40%, #0096C7 70%, #F48C06 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      {/* 로고 영역 */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 80, height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)',
          }}
        >
          <DirectionsBoatIcon sx={{ fontSize: 40, color: '#fff' }} />
        </Box>
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
          부산히스토리
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
          부산의 역사를 함께 탐방해요
        </Typography>
      </Box>

      {/* 카드 */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'rgba(255,255,255,0.95)',
          borderRadius: 4,
          p: 3,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => { setTab(v); setMessage(null) }}
          variant="fullWidth"
          sx={{ mb: 3, '& .MuiTabs-indicator': { backgroundColor: 'primary.main', height: 3 } }}
        >
          <Tab label="로그인" sx={{ fontWeight: 600 }} />
          <Tab label="회원가입" sx={{ fontWeight: 600 }} />
        </Tabs>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2, borderRadius: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tab === 1 && (
            <TextField
              label="닉네임"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
              }}
            />
          )}
          <TextField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            InputProps={{
              startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
            }}
          />
          <TextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            inputProps={{ minLength: 6 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            size="large"
            sx={{
              mt: 1,
              py: 1.5,
              background: 'linear-gradient(135deg, #0077B6, #0096C7)',
              '&:hover': { background: 'linear-gradient(135deg, #023E8A, #0077B6)' },
            }}
          >
            {loading ? '처리 중...' : tab === 0 ? '로그인' : '회원가입'}
          </Button>
        </Box>
      </Box>

      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 3 }}>
        부산광역시 역사탐방 서비스
      </Typography>
    </Box>
  )
}

export default LoginPage

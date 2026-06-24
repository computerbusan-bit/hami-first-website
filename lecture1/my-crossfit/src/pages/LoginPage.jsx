import { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Tabs, Tab } from '@mui/material';
import { FitnessCenterRounded } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(formData.email, formData.password);
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else {
      navigate('/posts');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.name, formData.phone);
    if (error) {
      setError(error.message || '회원가입에 실패했습니다.');
    } else {
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      setTab(0);
      setFormData(prev => ({ ...prev, name: '', phone: '' }));
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #0d1a0d 0%, #0d0d0d 60%)',
        px: 2,
        py: 4,
      }}
    >
      {/* 로고 */}
      <Box textAlign="center" mb={4}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={1}>
          <FitnessCenterRounded sx={{ color: 'primary.main', fontSize: { xs: 32, sm: 40 } }} />
          <Typography
            fontWeight={900}
            color="primary"
            letterSpacing={3}
            sx={{ fontSize: { xs: '1.6rem', sm: '2rem' } }}
          >
            CROSSFIT
          </Typography>
        </Box>
        <Typography
          fontWeight={800}
          color="text.primary"
          letterSpacing={6}
          sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
        >
          GROUND
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1.5}>
          크로스핏 커뮤니티에 오신 것을 환영합니다
        </Typography>
      </Box>

      {/* 폼 카드 */}
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); }}
            variant="fullWidth"
            sx={{
              mb: 3,
              '& .MuiTab-root': { fontSize: '0.9rem', py: 1.5 },
            }}
          >
            <Tab label="로그인" />
            <Tab label="회원가입" />
          </Tabs>

          {tab === 0 ? (
            <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2.5}>
              <TextField
                name="email"
                label="이메일"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="email"
              />
              <TextField
                name="password"
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="current-password"
              />
              {error && (
                <Box
                  sx={{
                    bgcolor: 'rgba(244, 67, 54, 0.08)',
                    border: '1px solid',
                    borderColor: 'error.main',
                    borderRadius: 1.5,
                    px: 2,
                    py: 1.2,
                  }}
                >
                  <Typography color="error" variant="body2" fontWeight={500}>
                    {error}
                  </Typography>
                </Box>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 0.5, py: 1.4, fontSize: '1rem', fontWeight: 700 }}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister} display="flex" flexDirection="column" gap={2.5}>
              <TextField
                name="name"
                label="이름"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="name"
              />
              <TextField
                name="email"
                label="이메일"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="email"
              />
              <TextField
                name="phone"
                label="전화번호"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                placeholder="010-0000-0000"
                autoComplete="tel"
              />
              <TextField
                name="password"
                label="비밀번호 (6자 이상)"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="new-password"
              />
              {error && (
                <Box
                  sx={{
                    bgcolor: 'rgba(244, 67, 54, 0.08)',
                    border: '1px solid',
                    borderColor: 'error.main',
                    borderRadius: 1.5,
                    px: 2,
                    py: 1.2,
                  }}
                >
                  <Typography color="error" variant="body2" fontWeight={500}>
                    {error}
                  </Typography>
                </Box>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 0.5, py: 1.4, fontSize: '1rem', fontWeight: 700 }}
              >
                {loading ? '가입 중...' : '회원가입'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;

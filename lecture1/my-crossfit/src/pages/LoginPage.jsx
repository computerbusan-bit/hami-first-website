import { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Tabs, Tab,
} from '@mui/material';
import { FitnessCenterRounded, LockRounded, PersonAddRounded } from '@mui/icons-material';
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
    if (error) setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    else navigate('/posts');
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('이름을 입력해주세요.'); return; }
    setLoading(true);
    const { error } = await signUp(formData.email, formData.password, formData.name, formData.phone);
    if (error) {
      setError(error.message || '회원가입에 실패했습니다.');
    } else {
      alert('회원가입 완료! 로그인해주세요.');
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
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,230,118,0.06) 0%, transparent 70%), #0a0a0a',
        px: 2,
        py: 5,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        {/* 로고 영역 */}
        <Box textAlign="center" mb={5}>
          <Box
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 64, height: 64,
              bgcolor: 'rgba(0,230,118,0.1)',
              borderRadius: '50%',
              mb: 2.5,
              border: '1px solid rgba(0,230,118,0.2)',
            }}
          >
            <FitnessCenterRounded sx={{ color: 'primary.main', fontSize: 30 }} />
          </Box>
          <Typography
            fontWeight={900}
            color="primary"
            letterSpacing={3}
            sx={{ fontSize: '1.5rem', lineHeight: 1 }}
          >
            CROSSFIT GROUND
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1.5} letterSpacing={0.5}>
            크로스핏 커뮤니티에 오신 것을 환영합니다
          </Typography>
        </Box>

        {/* 카드 */}
        <Paper
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); }}
            variant="fullWidth"
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: 'rgba(255,255,255,0.02)',
              '& .MuiTab-root': { py: 2 },
            }}
          >
            <Tab
              label="로그인"
              icon={<LockRounded sx={{ fontSize: 16 }} />}
              iconPosition="start"
            />
            <Tab
              label="회원가입"
              icon={<PersonAddRounded sx={{ fontSize: 16 }} />}
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            {tab === 0 ? (
              <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2.5}>
                <TextField name="email" label="이메일" type="email"
                  value={formData.email} onChange={handleChange} required fullWidth autoComplete="email" />
                <TextField name="password" label="비밀번호" type="password"
                  value={formData.password} onChange={handleChange} required fullWidth autoComplete="current-password" />

                {error && (
                  <Box sx={{ bgcolor: 'rgba(244,67,54,0.07)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 1.5, px: 2, py: 1.25 }}>
                    <Typography color="error" variant="body2" fontWeight={500}>{error}</Typography>
                  </Box>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth size="large"
                  disabled={loading} sx={{ py: 1.5, fontWeight: 700, fontSize: '0.95rem', mt: 0.5 }}>
                  {loading ? '로그인 중...' : '로그인'}
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleRegister} display="flex" flexDirection="column" gap={2.5}>
                <TextField name="name" label="이름"
                  value={formData.name} onChange={handleChange} required fullWidth autoComplete="name" />
                <TextField name="email" label="이메일" type="email"
                  value={formData.email} onChange={handleChange} required fullWidth autoComplete="email" />
                <TextField name="phone" label="전화번호 (선택)"
                  value={formData.phone} onChange={handleChange} fullWidth placeholder="010-0000-0000" autoComplete="tel" />
                <TextField name="password" label="비밀번호 (6자 이상)" type="password"
                  value={formData.password} onChange={handleChange} required fullWidth autoComplete="new-password" />

                {error && (
                  <Box sx={{ bgcolor: 'rgba(244,67,54,0.07)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 1.5, px: 2, py: 1.25 }}>
                    <Typography color="error" variant="body2" fontWeight={500}>{error}</Typography>
                  </Box>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth size="large"
                  disabled={loading} sx={{ py: 1.5, fontWeight: 700, fontSize: '0.95rem', mt: 0.5 }}>
                  {loading ? '가입 중...' : '회원가입'}
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;

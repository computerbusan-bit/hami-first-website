import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box,
  Avatar, Menu, MenuItem, useMediaQuery, useTheme,
} from '@mui/material';
import { FitnessCenterRounded, EditRounded, ExpandMoreRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    setAnchorEl(null);
    await signOut();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(10,10,10,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: { xs: '56px !important', sm: '64px !important' },
          px: { xs: 2, sm: 3 },
          maxWidth: 960,
          width: '100%',
          mx: 'auto',
        }}
      >
        {/* 로고 */}
        <Box
          onClick={() => navigate('/posts')}
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
        >
          <FitnessCenterRounded sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 22 } }} />
          <Typography fontWeight={900} color="primary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' }, letterSpacing: { xs: 1, sm: 2 }, lineHeight: 1 }}>
            CROSSFIT GROUND
          </Typography>
        </Box>

        {/* 우측 메뉴 */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flexShrink: 0 }}>
          {!isMobile && (
            <Button onClick={() => navigate('/posts')} sx={{ color: 'text.secondary', fontWeight: 500 }}>
              게시판
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate('/posts/write')}
            sx={{ fontWeight: 700, px: { xs: 1.5, sm: 2 }, py: 0.75, minWidth: 0, fontSize: '0.82rem' }}
          >
            {isMobile ? <EditRounded sx={{ fontSize: 18 }} /> : '+ 글쓰기'}
          </Button>

          {user && (
            <>
              <Box
                onClick={e => setAnchorEl(e.currentTarget)}
                sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.75, cursor: 'pointer' }}
              >
                <Avatar sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 }, bgcolor: 'primary.main', color: '#000', fontSize: '0.78rem', fontWeight: 800 }}>
                  {(profile?.name?.[0] || user.email?.[0])?.toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 0.25 }}>
                    <Typography variant="body2" sx={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'text.secondary' }}>
                      {profile?.name || user.email}
                    </Typography>
                    <ExpandMoreRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
                  </Box>
                )}
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ elevation: 0, sx: { mt: 1.5, minWidth: 140, border: '1px solid', borderColor: 'divider', borderRadius: 2 } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {isMobile && (
                  <MenuItem disabled sx={{ fontSize: '0.8rem', opacity: 0.6 }}>
                    {profile?.name || user.email}
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontSize: '0.88rem', py: 1.25 }}>
                  로그아웃
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

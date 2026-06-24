import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box,
  Avatar, Menu, MenuItem, IconButton, useMediaQuery, useTheme
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
        bgcolor: 'rgba(13, 13, 13, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: { xs: 56, sm: 64 } }}>
        {/* 로고 */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: 'pointer', flexShrink: 0 }}
          onClick={() => navigate('/posts')}
        >
          <FitnessCenterRounded sx={{ color: 'primary.main', fontSize: { xs: 22, sm: 26 } }} />
          <Typography
            fontWeight={900}
            color="primary"
            letterSpacing={1}
            sx={{ fontSize: { xs: '0.95rem', sm: '1.1rem' } }}
          >
            CROSSFIT GROUND
          </Typography>
        </Box>

        <Box flex={1} />

        {/* 우측 메뉴 */}
        <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
          {!isMobile && (
            <Button
              onClick={() => navigate('/posts')}
              sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.9rem' }}
            >
              게시판
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate('/posts/write')}
            startIcon={!isMobile ? <EditRounded /> : undefined}
            sx={{ minWidth: { xs: 36, sm: 'auto' }, px: { xs: 1, sm: 2 } }}
          >
            {isMobile ? <EditRounded fontSize="small" /> : '글쓰기'}
          </Button>

          {user && (
            <>
              <Box
                display="flex"
                alignItems="center"
                gap={0.75}
                sx={{ cursor: 'pointer' }}
                onClick={e => setAnchorEl(e.currentTarget)}
              >
                <Avatar
                  sx={{
                    width: { xs: 30, sm: 32 },
                    height: { xs: 30, sm: 32 },
                    bgcolor: 'primary.main',
                    fontSize: '0.8rem',
                    color: '#000',
                    fontWeight: 700,
                  }}
                >
                  {(profile?.name?.[0] || user.email?.[0])?.toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <>
                    <Typography variant="body2" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profile?.name || user.email}
                    </Typography>
                    <ExpandMoreRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
                  </>
                )}
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { mt: 1, minWidth: 140 } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {isMobile && (
                  <MenuItem disabled sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
                    {profile?.name || user.email}
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontSize: '0.9rem' }}>
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

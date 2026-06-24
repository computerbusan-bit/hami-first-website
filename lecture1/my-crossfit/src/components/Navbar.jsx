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
          maxWidth: 1200,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* 로고 */}
        <Box
          display="flex" alignItems="center" gap={1}
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => navigate('/posts')}
        >
          <FitnessCenterRounded
            sx={{ color: 'primary.main', fontSize: { xs: 20, sm: 24 } }}
          />
          <Typography
            fontWeight={900}
            color="primary"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1.05rem' },
              letterSpacing: { xs: 1, sm: 2 },
              lineHeight: 1,
            }}
          >
            CROSSFIT GROUND
          </Typography>
        </Box>

        <Box flex={1} />

        <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 1.5 }}>
          {!isMobile && (
            <Button
              onClick={() => navigate('/posts')}
              sx={{ color: 'text.secondary', fontWeight: 500, px: 1.5 }}
            >
              게시판
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate('/posts/write')}
            sx={{
              fontWeight: 700,
              px: { xs: 1.5, sm: 2 },
              py: 0.75,
              minWidth: 0,
              fontSize: '0.82rem',
            }}
          >
            {isMobile ? <EditRounded sx={{ fontSize: 18 }} /> : '+ 글쓰기'}
          </Button>

          {user && (
            <>
              <Box
                display="flex" alignItems="center" gap={0.75}
                sx={{ cursor: 'pointer', pl: 0.5 }}
                onClick={e => setAnchorEl(e.currentTarget)}
              >
                <Avatar
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    bgcolor: 'primary.main',
                    color: '#000',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                  }}
                >
                  {(profile?.name?.[0] || user.email?.[0])?.toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <Box display="flex" alignItems="center" gap={0.25}>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 88,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.85rem',
                        color: 'text.secondary',
                      }}
                    >
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
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    minWidth: 150,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {isMobile && (
                  <MenuItem disabled sx={{ fontSize: '0.8rem', opacity: 0.6 }}>
                    {profile?.name || user.email}
                  </MenuItem>
                )}
                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: 'error.main', fontSize: '0.88rem', py: 1.25 }}
                >
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

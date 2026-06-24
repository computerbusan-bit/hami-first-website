import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { FitnessCenterRounded, ExpandMoreRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    setAnchorEl(null);
    await signOut();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: '#0d0d0d', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/posts')}
        >
          <FitnessCenterRounded sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" fontWeight={900} color="primary" letterSpacing={1}>
            CROSSFIT GROUND
          </Typography>
        </Box>

        <Box flex={1} />

        <Box display="flex" alignItems="center" gap={2}>
          <Button
            color="inherit"
            onClick={() => navigate('/posts')}
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            게시판
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate('/posts/write')}
          >
            글쓰기
          </Button>

          {user && (
            <>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ cursor: 'pointer', ml: 1 }}
                onClick={e => setAnchorEl(e.currentTarget)}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem', color: '#000' }}>
                  {(profile?.name?.[0] || user.email?.[0])?.toUpperCase()}
                </Avatar>
                <Typography variant="body2">{profile?.name || user.email}</Typography>
                <ExpandMoreRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { mt: 1 } }}
              >
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', minWidth: 120 }}>
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

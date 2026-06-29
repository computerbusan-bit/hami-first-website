import { useLocation, useNavigate } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import HomeIcon from '@mui/icons-material/Home'
import ExploreIcon from '@mui/icons-material/Explore'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import PersonIcon from '@mui/icons-material/Person'

const NAV_ITEMS = [
  { label: '홈', icon: <HomeIcon />, path: '/' },
  { label: '탐방', icon: <ExploreIcon />, path: '/places' },
  { label: '스탬프', icon: <AutoStoriesIcon />, path: '/stamp' },
  { label: '마이', icon: <PersonIcon />, path: '/my' },
]

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const currentIndex = NAV_ITEMS.findIndex(
    (item) => item.path === location.pathname
  )

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        maxWidth: 480,
        mx: 'auto',
      }}
    >
      <BottomNavigation
        value={currentIndex === -1 ? false : currentIndex}
        onChange={(_, newValue) => navigate(NAV_ITEMS[newValue].path)}
        sx={{ height: 64 }}
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
            sx={{
              '&.Mui-selected': {
                color: 'primary.main',
              },
              minWidth: 0,
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

export default BottomNav

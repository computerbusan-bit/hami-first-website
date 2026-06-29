import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import LogoutIcon from '@mui/icons-material/Logout'
import InfoIcon from '@mui/icons-material/Info'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PlaceIcon from '@mui/icons-material/Place'

const MyPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [scrappedPlaces, setScrappedPlaces] = useState([])
  const [stampCount, setStampCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      setLoading(true)
      const [{ data: scrapsData }, { data: stampsData }] = await Promise.all([
        supabase
          .from('busan_scraps')
          .select('place_id, busan_places(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase.from('busan_stamps').select('id').eq('user_id', user.id),
      ])
      if (scrapsData) setScrappedPlaces(scrapsData.map((s) => s.busan_places).filter(Boolean))
      if (stampsData) setStampCount(stampsData.length)
      setLoading(false)
    }
    fetchData()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '탐방자'
  const email = user?.email || ''

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      {/* 프로필 헤더 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 100%)',
          pt: 6, pb: 4, px: 2.5,
          borderRadius: '0 0 28px 28px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 64, height: 64,
              bgcolor: 'secondary.main',
              fontSize: '1.5rem', fontWeight: 700,
              border: '3px solid rgba(255,255,255,0.5)',
            }}
          >
            {username[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>{username}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>{email}</Typography>
          </Box>
        </Box>

        {/* 통계 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              flex: 1, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, p: 1.5, textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>{scrappedPlaces.length}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>스크랩</Typography>
          </Box>
          <Box
            sx={{
              flex: 1, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, p: 1.5, textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>{stampCount}</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>스탬프</Typography>
          </Box>
          <Box
            sx={{
              flex: 1, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, p: 1.5, textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>12</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>전체 장소</Typography>
          </Box>
        </Box>
      </Box>

      {/* 스크랩한 장소 */}
      <Box sx={{ px: 2.5, mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <BookmarkIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="h5" fontWeight={700}>스크랩한 장소</Typography>
          <Chip label={scrappedPlaces.length} size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto' }}>
            {[1, 2].map((i) => <Skeleton key={i} variant="rectangular" width={160} height={180} sx={{ borderRadius: 3, flexShrink: 0 }} />)}
          </Box>
        ) : scrappedPlaces.length === 0 ? (
          <Box
            sx={{
              bgcolor: 'background.paper', borderRadius: 3, p: 3, textAlign: 'center',
              border: '2px dashed rgba(0,0,0,0.1)',
            }}
          >
            <BookmarkIcon sx={{ fontSize: 40, color: 'rgba(0,0,0,0.15)', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              아직 스크랩한 장소가 없어요
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: 1.5, borderRadius: 2.5 }}
              onClick={() => navigate('/places')}
            >
              장소 탐방하기
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
            {scrappedPlaces.map((place) => (
              <Card
                key={place.id}
                sx={{ width: 160, flexShrink: 0, cursor: 'pointer' }}
                onClick={() => navigate(`/places/${place.id}`)}
              >
                <CardMedia component="img" height="110" image={place.image_url} alt={place.name} sx={{ objectFit: 'cover' }} />
                <CardContent sx={{ p: 1.2, '&:last-child': { pb: 1.2 } }}>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }} display="block">
                    {place.location}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} noWrap>{place.name}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* 설정 메뉴 */}
      <Box sx={{ mx: 2.5, mt: 3, bgcolor: 'background.paper', borderRadius: 3, overflow: 'hidden' }}>
        <List disablePadding>
          <ListItem
            button
            onClick={() => navigate('/stamp')}
            sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(0,119,182,0.04)' } }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AutoStoriesIcon sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText primary="역사 여권" secondary="나의 방문 기록 보기" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
            <ChevronRightIcon sx={{ color: 'text.secondary' }} />
          </ListItem>
          <Divider />
          <ListItem sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <InfoIcon sx={{ color: 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText primary="앱 정보" secondary="부산히스토리 v1.0.0" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={handleSignOut}
            sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(230,57,70,0.04)' } }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText primary="로그아웃" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem', color: 'error.main' }} />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="caption" color="text.secondary">
          부산히스토리 · 부산의 역사를 함께 탐방해요 ⚓
        </Typography>
      </Box>
    </Box>
  )
}

export default MyPage

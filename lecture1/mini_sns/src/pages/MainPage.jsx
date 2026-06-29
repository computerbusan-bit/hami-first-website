import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import SearchIcon from '@mui/icons-material/Search'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PlaceIcon from '@mui/icons-material/Place'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import NaturePeopleIcon from '@mui/icons-material/NaturePeople'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import RestaurantIcon from '@mui/icons-material/Restaurant'

const CATEGORIES = [
  { label: '전체', value: 'all', icon: '🗺️' },
  { label: '근대역사', value: '근대역사', icon: '🏛️' },
  { label: '전통문화', value: '전통문화', icon: '🎎' },
  { label: '자연경관', value: '자연경관', icon: '🌊' },
]

const COURSES = [
  { title: '원도심 근대역사 코스', description: '부산타워 → 국제시장 → 자갈치시장', duration: '2~3시간', icon: '🏛️', color: '#0077B6' },
  { title: '영도 낭만 코스', description: '영도대교 → 태종대 → 깡깡이예술마을', duration: '3~4시간', icon: '⚓', color: '#E85D04' },
  { title: '동구 이바구 코스', description: '초량이바구길 → 168계단 → 부산근대역사관', duration: '1~2시간', icon: '👣', color: '#06A77D' },
]

const MainPage = () => {
  const [places, setPlaces] = useState([])
  const [featured, setFeatured] = useState([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('busan_places')
        .select('*')
        .order('likes_count', { ascending: false })
      if (data) {
        setPlaces(data)
        setFeatured(data.filter((p) => p.is_featured).slice(0, 5))
      }
      setLoading(false)
    }
    fetchPlaces()
  }, [])

  const filtered = places.filter((p) => {
    const matchCat = category === 'all' || p.category === category
    const matchSearch = !search || p.name.includes(search) || p.location.includes(search)
    return matchCat && matchSearch
  }).slice(0, 6)

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '여행자'

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* 헤더 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 60%, #0096C7 100%)',
          pt: 5, pb: 4, px: 2.5,
          borderRadius: '0 0 28px 28px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              안녕하세요, {username}님 👋
            </Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mt: 0.3 }}>
              부산히스토리
            </Typography>
          </Box>
          <Box
            sx={{
              width: 44, height: 44, borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <AutoStoriesIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
        </Box>

        <TextField
          placeholder="장소 이름 또는 지역을 검색하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#fff',
              borderRadius: 3,
              '& fieldset': { border: 'none' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* 카테고리 */}
      <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap', overflowX: 'auto', pb: 0.5 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.value}
              label={`${cat.icon} ${cat.label}`}
              onClick={() => setCategory(cat.value)}
              variant={category === cat.value ? 'filled' : 'outlined'}
              color={category === cat.value ? 'primary' : 'default'}
              sx={{
                flexShrink: 0,
                fontWeight: category === cat.value ? 700 : 500,
                borderColor: category === cat.value ? 'primary.main' : 'rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 추천 장소 (가로 스크롤) */}
      <Box sx={{ px: 2.5, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h5" fontWeight={700}>✨ 추천 역사 장소</Typography>
          <Typography
            variant="caption"
            sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/places')}
          >
            전체보기 →
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1.5 }}>
          {loading
            ? [1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" width={180} height={200} sx={{ borderRadius: 3, flexShrink: 0 }} />
            ))
            : featured.map((place) => (
              <Card
                key={place.id}
                sx={{ width: 180, flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onClick={() => navigate(`/places/${place.id}`)}
              >
                <CardMedia
                  component="img"
                  height="130"
                  image={place.image_url}
                  alt={place.name}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute', top: 8, right: 8,
                    bgcolor: 'secondary.main', color: '#fff',
                    borderRadius: 2, px: 0.8, py: 0.2,
                    fontSize: '0.65rem', fontWeight: 700,
                  }}
                >
                  추천
                </Box>
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {place.location}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {place.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.5 }}>
                    <FavoriteIcon sx={{ fontSize: 12, color: 'error.main' }} />
                    <Typography variant="caption" color="text.secondary">{place.likes_count}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          }
        </Box>
      </Box>

      {/* 테마별 탐방 코스 */}
      <Box sx={{ px: 2.5, mt: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>🗺️ 테마별 탐방 코스</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {COURSES.map((course, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex', alignItems: 'center', gap: 2,
                bgcolor: 'background.paper', borderRadius: 3, p: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                '&:active': { opacity: 0.9 },
              }}
            >
              <Box
                sx={{
                  width: 48, height: 48, borderRadius: 2,
                  bgcolor: course.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0,
                }}
              >
                {course.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={700}>{course.title}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  {course.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <DirectionsWalkIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">{course.duration}</Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 인기 장소 목록 */}
      <Box sx={{ px: 2.5, mt: 3, pb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>🔥 인기 역사 장소</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {loading
            ? [1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 3 }} />
            ))
            : filtered.map((place) => (
              <Card
                key={place.id}
                sx={{ cursor: 'pointer', display: 'flex', overflow: 'hidden', height: 88 }}
                onClick={() => navigate(`/places/${place.id}`)}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 96, objectFit: 'cover', flexShrink: 0 }}
                  image={place.image_url}
                  alt={place.name}
                />
                <CardContent sx={{ p: 1.5, flex: 1, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Chip label={place.category} size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: '0.6rem' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <FavoriteIcon sx={{ fontSize: 12, color: 'error.main' }} />
                      <Typography variant="caption">{place.likes_count}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }} noWrap>{place.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.3 }}>
                    <PlaceIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">{place.location}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          }
        </Box>
      </Box>
    </Box>
  )
}

export default MainPage

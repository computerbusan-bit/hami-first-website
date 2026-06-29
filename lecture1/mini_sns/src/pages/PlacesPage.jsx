import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Snackbar from '@mui/material/Snackbar'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PlaceIcon from '@mui/icons-material/Place'

const CATEGORIES = ['전체', '근대역사', '전통문화', '자연경관']

const PlacesPage = () => {
  const [places, setPlaces] = useState([])
  const [scraps, setScraps] = useState(new Set())
  const [category, setCategory] = useState('전체')
  const [loading, setLoading] = useState(true)
  const [snack, setSnack] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [{ data: placesData }, { data: scrapsData }] = await Promise.all([
        supabase.from('busan_places').select('*').order('likes_count', { ascending: false }),
        user ? supabase.from('busan_scraps').select('place_id').eq('user_id', user.id) : Promise.resolve({ data: [] }),
      ])
      if (placesData) setPlaces(placesData)
      if (scrapsData) setScraps(new Set(scrapsData.map((s) => s.place_id)))
      setLoading(false)
    }
    fetchData()
  }, [user])

  const toggleScrap = async (e, placeId) => {
    e.stopPropagation()
    if (!user) return
    const isScraped = scraps.has(placeId)
    const next = new Set(scraps)
    if (isScraped) {
      await supabase.from('busan_scraps').delete().eq('user_id', user.id).eq('place_id', placeId)
      next.delete(placeId)
      setSnack('스크랩이 취소되었습니다.')
    } else {
      await supabase.from('busan_scraps').insert({ user_id: user.id, place_id: placeId })
      next.add(placeId)
      setSnack('스크랩에 저장되었습니다! 🔖')
    }
    setScraps(next)
  }

  const filtered = category === '전체' ? places : places.filter((p) => p.category === category)

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* 헤더 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 100%)',
          pt: 5, pb: 3, px: 2.5,
          borderRadius: '0 0 24px 24px',
        }}
      >
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
          역사 장소 탐방
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          부산의 역사적인 장소들을 둘러보세요
        </Typography>

        {/* 카테고리 필터 */}
        <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 0.5 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setCategory(cat)}
              sx={{
                flexShrink: 0,
                color: category === cat ? 'primary.main' : '#fff',
                bgcolor: category === cat ? '#fff' : 'rgba(255,255,255,0.2)',
                fontWeight: 600,
                border: 'none',
                '&:hover': { bgcolor: category === cat ? '#fff' : 'rgba(255,255,255,0.3)' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 장소 목록 */}
      <Box sx={{ px: 2, pt: 2, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          총 {filtered.length}개의 장소
        </Typography>

        <Grid container spacing={1.5}>
          {loading
            ? [1, 2, 3, 4].map((i) => (
              <Grid item xs={6} key={i}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
            : filtered.map((place) => (
              <Grid item xs={6} key={place.id}>
                <Card
                  sx={{ cursor: 'pointer', position: 'relative', height: '100%' }}
                  onClick={() => navigate(`/places/${place.id}`)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={place.image_url}
                      alt={place.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={(e) => toggleScrap(e, place.id)}
                      sx={{
                        position: 'absolute', top: 6, right: 6,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        p: 0.7,
                        '&:hover': { bgcolor: '#fff' },
                      }}
                      size="small"
                    >
                      {scraps.has(place.id)
                        ? <BookmarkIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        : <BookmarkBorderIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      }
                    </IconButton>
                    {place.is_featured && (
                      <Box
                        sx={{
                          position: 'absolute', bottom: 6, left: 6,
                          bgcolor: 'secondary.main', color: '#fff',
                          borderRadius: 1.5, px: 0.8, py: 0.2,
                          fontSize: '0.6rem', fontWeight: 700,
                        }}
                      >
                        추천
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Chip
                      label={place.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: 18, fontSize: '0.6rem', mb: 0.5 }}
                    />
                    <Typography variant="body2" fontWeight={700} noWrap sx={{ mb: 0.3 }}>
                      {place.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <PlaceIcon sx={{ fontSize: 11, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{place.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <FavoriteIcon sx={{ fontSize: 11, color: 'error.main' }} />
                        <Typography variant="caption">{place.likes_count}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          }
        </Grid>
      </Box>

      <Snackbar
        open={!!snack}
        autoHideDuration={2000}
        onClose={() => setSnack('')}
        message={snack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: 80 }}
      />
    </Box>
  )
}

export default PlacesPage

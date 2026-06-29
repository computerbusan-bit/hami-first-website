import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import VerifiedIcon from '@mui/icons-material/Verified'
import LockIcon from '@mui/icons-material/Lock'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const STAMP_EMOJIS = {
  '감천문화마을': '🎨',
  '용두산공원 & 부산타워': '🗼',
  '자갈치시장': '🐟',
  '부산근대역사관': '🏛️',
  '초량이바구길': '👣',
  '영도대교': '🌉',
  '태종대': '⛰️',
  'UN기념공원': '🕊️',
  '해운대해수욕장': '🏖️',
  '광안리해수욕장': '🌊',
  '국제시장': '🛍️',
  '168계단': '🪜',
}

const BADGE_LEVELS = [
  { min: 0, label: '역사 초보', emoji: '🌱', color: '#9CA3AF' },
  { min: 3, label: '역사 탐험가', emoji: '🧭', color: '#F48C06' },
  { min: 6, label: '역사 연구가', emoji: '📚', color: '#0077B6' },
  { min: 10, label: '부산 역사 마스터', emoji: '🏆', color: '#E85D04' },
]

const StampPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [places, setPlaces] = useState([])
  const [stamps, setStamps] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      setLoading(true)
      const [{ data: placesData }, { data: stampsData }] = await Promise.all([
        supabase.from('busan_places').select('id, name, location, image_url, category').order('created_at'),
        supabase.from('busan_stamps').select('place_id, verified_at').eq('user_id', user.id),
      ])
      if (placesData) setPlaces(placesData)
      if (stampsData) setStamps(new Set(stampsData.map((s) => s.place_id)))
      setLoading(false)
    }
    fetchData()
  }, [user])

  const total = places.length
  const collected = stamps.size
  const progress = total > 0 ? (collected / total) * 100 : 0

  const badge = BADGE_LEVELS.reduce((acc, level) => (collected >= level.min ? level : acc), BADGE_LEVELS[0])

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      {/* 여권 헤더 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #F48C06 100%)',
          pt: 6, pb: 4, px: 2.5,
          borderRadius: '0 0 28px 28px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 2 }}>
              BUSAN HISTORY PASSPORT
            </Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mt: 0.3 }}>
              📒 역사 여권
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
              부산 역사 장소를 방문하고 도장을 모아보세요
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: '2rem' }}>{badge.emoji}</Box>
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700, display: 'block', mt: 0.3 }}>
              {badge.label}
            </Typography>
          </Box>
        </Box>

        {/* 진행도 */}
        <Box sx={{ mt: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              방문 현황
            </Typography>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 800 }}>
              {collected} / {total}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10, borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.25)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#FCBF49',
                borderRadius: 5,
              },
            }}
          />
        </Box>
      </Box>

      {/* 뱃지 안내 */}
      <Box sx={{ px: 2.5, mt: 2.5 }}>
        <Typography variant="body2" fontWeight={700} color="text.secondary" gutterBottom>
          도장 수집 뱃지
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
          {BADGE_LEVELS.map((level) => (
            <Box
              key={level.min}
              sx={{
                flexShrink: 0, textAlign: 'center',
                bgcolor: 'background.paper', borderRadius: 2.5, p: 1.5,
                border: collected >= level.min ? `2px solid ${level.color}` : '2px solid transparent',
                opacity: collected >= level.min ? 1 : 0.5,
                minWidth: 80,
              }}
            >
              <Box sx={{ fontSize: '1.4rem' }}>{level.emoji}</Box>
              <Typography variant="caption" fontWeight={700} display="block" sx={{ fontSize: '0.65rem', mt: 0.3 }}>
                {level.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                {level.min}개~
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 스탬프 그리드 */}
      <Box sx={{ px: 2.5, mt: 2, pb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
          🗺️ 도장판
        </Typography>

        {loading ? (
          <Grid container spacing={1.5}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={4} key={i}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={1.5}>
            {places.map((place) => {
              const stamped = stamps.has(place.id)
              return (
                <Grid item xs={4} key={place.id}>
                  <Box
                    onClick={() => navigate(`/places/${place.id}`)}
                    sx={{
                      position: 'relative', cursor: 'pointer',
                      borderRadius: 3, overflow: 'hidden',
                      border: stamped ? '2px solid' : '2px solid',
                      borderColor: stamped ? 'success.main' : 'rgba(0,0,0,0.1)',
                      bgcolor: 'background.paper',
                      textAlign: 'center',
                      transition: 'transform 0.15s',
                      '&:active': { transform: 'scale(0.97)' },
                    }}
                  >
                    {/* 배경 이미지 (흑백 or 컬러) */}
                    <Box
                      component="img"
                      src={place.image_url}
                      alt={place.name}
                      sx={{
                        width: '100%', height: 80, objectFit: 'cover',
                        filter: stamped ? 'none' : 'grayscale(100%) opacity(0.3)',
                      }}
                    />

                    {/* 스탬프 오버레이 */}
                    {stamped ? (
                      <Box
                        sx={{
                          position: 'absolute', top: 4, right: 4,
                          bgcolor: 'success.main', borderRadius: '50%',
                          width: 24, height: 24,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <VerifiedIcon sx={{ fontSize: 16, color: '#fff' }} />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <LockIcon sx={{ fontSize: 28, color: 'rgba(0,0,0,0.2)' }} />
                      </Box>
                    )}

                    {/* 장소 이름 */}
                    <Box sx={{ p: 0.8 }}>
                      <Typography
                        variant="caption"
                        fontWeight={stamped ? 700 : 500}
                        color={stamped ? 'success.main' : 'text.disabled'}
                        sx={{ fontSize: '0.6rem', display: 'block', lineHeight: 1.3 }}
                      >
                        {STAMP_EMOJIS[place.name] || '📍'} {place.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        )}

        {collected === total && total > 0 && (
          <Box
            sx={{
              mt: 3, p: 2.5, borderRadius: 3,
              background: 'linear-gradient(135deg, #F48C06, #E85D04)',
              textAlign: 'center',
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 40, color: '#fff', mb: 1 }} />
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>
              🎉 완주 달성!
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.5 }}>
              부산의 모든 역사 장소를 방문했습니다!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default StampPage

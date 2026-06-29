import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Skeleton from '@mui/material/Skeleton'
import Snackbar from '@mui/material/Snackbar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import PlaceIcon from '@mui/icons-material/Place'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VerifiedIcon from '@mui/icons-material/Verified'
import SendIcon from '@mui/icons-material/Send'

const PlaceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [place, setPlace] = useState(null)
  const [comments, setComments] = useState([])
  const [isScraped, setIsScraped] = useState(false)
  const [isStamped, setIsStamped] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [snack, setSnack] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [{ data: placeData }, { data: commentsData }, { data: scrapData }, { data: stampData }] = await Promise.all([
        supabase.from('busan_places').select('*').eq('id', id).single(),
        supabase.from('busan_comments').select('*').eq('place_id', id).order('created_at', { ascending: false }),
        user ? supabase.from('busan_scraps').select('id').eq('user_id', user.id).eq('place_id', id).maybeSingle() : Promise.resolve({ data: null }),
        user ? supabase.from('busan_stamps').select('id').eq('user_id', user.id).eq('place_id', id).maybeSingle() : Promise.resolve({ data: null }),
      ])
      setPlace(placeData)
      setComments(commentsData || [])
      setIsScraped(!!scrapData)
      setIsStamped(!!stampData)
      setLoading(false)
    }
    fetchData()
  }, [id, user])

  const toggleScrap = async () => {
    if (!user) return
    if (isScraped) {
      await supabase.from('busan_scraps').delete().eq('user_id', user.id).eq('place_id', id)
      setIsScraped(false)
      setSnack('스크랩이 취소되었습니다.')
    } else {
      await supabase.from('busan_scraps').insert({ user_id: user.id, place_id: id })
      setIsScraped(true)
      setSnack('스크랩에 저장되었습니다! 🔖')
    }
  }

  const getStamp = async () => {
    if (!user || isStamped) return
    const { error } = await supabase.from('busan_stamps').insert({ user_id: user.id, place_id: id })
    if (!error) {
      setIsStamped(true)
      setSnack('🎉 방문 도장을 찍었습니다!')
    }
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return
    const { data } = await supabase
      .from('busan_comments')
      .insert({ user_id: user.id, place_id: id, content: newComment.trim() })
      .select()
      .single()
    if (data) {
      setComments([data, ...comments])
      setNewComment('')
    }
  }

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={280} />
        <Box sx={{ p: 2.5 }}>
          <Skeleton height={40} sx={{ mb: 1 }} />
          <Skeleton height={20} width="60%" />
          <Skeleton height={100} sx={{ mt: 2 }} />
        </Box>
      </Box>
    )
  }

  if (!place) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>장소를 찾을 수 없습니다.</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100dvh' }}>
      {/* 이미지 헤더 */}
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={place.image_url}
          alt={place.name}
          sx={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
        />
        <Box
          sx={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)',
          }}
        />
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute', top: 48, left: 16,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: '#fff' },
          }}
          size="small"
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={toggleScrap}
          sx={{
            position: 'absolute', top: 48, right: 16,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: '#fff' },
          }}
          size="small"
        >
          {isScraped
            ? <BookmarkIcon sx={{ color: 'primary.main' }} />
            : <BookmarkBorderIcon />
          }
        </IconButton>

        {/* 장소 기본 정보 */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2 }}>
          <Chip
            label={place.category}
            size="small"
            sx={{ bgcolor: 'secondary.main', color: '#fff', fontWeight: 700, mb: 0.8, fontSize: '0.7rem' }}
          />
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800 }}>{place.name}</Typography>
        </Box>
      </Box>

      {/* 상세 내용 */}
      <Box sx={{ bgcolor: 'background.paper', borderRadius: '20px 20px 0 0', mt: -1, px: 2.5, pt: 2.5 }}>
        {/* 위치 & 좋아요 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PlaceIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">{place.location} · {place.address}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FavoriteIcon sx={{ fontSize: 16, color: 'error.main' }} />
            <Typography variant="body2" fontWeight={600}>{place.likes_count}</Typography>
          </Box>
        </Box>

        {/* 간단 설명 */}
        <Typography variant="body1" fontWeight={600} gutterBottom>{place.description}</Typography>

        <Divider sx={{ my: 2 }} />

        {/* 역사 이야기 */}
        <Typography variant="h6" fontWeight={700} gutterBottom>📖 역사 이야기</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.9 }}>
          {place.history}
        </Typography>

        {/* 방문 도장 */}
        <Box
          sx={{
            mt: 3, p: 2, borderRadius: 3,
            border: isStamped ? '2px solid' : '2px dashed',
            borderColor: isStamped ? 'success.main' : 'rgba(0,0,0,0.15)',
            bgcolor: isStamped ? 'rgba(6,167,125,0.05)' : 'background.default',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight={700}>
              {isStamped ? '✅ 방문 완료!' : '📍 여기 방문했나요?'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isStamped ? '도장이 찍혔습니다' : '도장을 찍고 기록을 남겨보세요'}
            </Typography>
          </Box>
          <Button
            variant={isStamped ? 'outlined' : 'contained'}
            size="small"
            onClick={getStamp}
            disabled={isStamped}
            color={isStamped ? 'success' : 'primary'}
            startIcon={<VerifiedIcon />}
            sx={{ borderRadius: 2.5, flexShrink: 0 }}
          >
            {isStamped ? '도장 완료' : '도장 찍기'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 댓글 */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          💬 방문 후기 ({comments.length})
        </Typography>

        <Box component="form" onSubmit={addComment} sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="방문 후기를 남겨보세요..."
            size="small"
            fullWidth
            multiline
            maxRows={3}
          />
          <IconButton type="submit" color="primary" disabled={!newComment.trim()} sx={{ alignSelf: 'flex-end', mb: 0.3 }}>
            <SendIcon />
          </IconButton>
        </Box>

        {comments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary">첫 번째 후기를 남겨보세요! 🌊</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pb: 2 }}>
            {comments.map((c) => (
              <Box key={c.id} sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.75rem' }}>
                  {(c.user_id || '?').slice(0, 2).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ bgcolor: 'background.default', borderRadius: 2, p: 1.5 }}>
                    <Typography variant="body2">{c.content}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: 'block' }}>
                    {new Date(c.created_at).toLocaleDateString('ko-KR')}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
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

export default PlaceDetailPage

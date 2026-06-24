import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper,
  useMediaQuery, useTheme,
} from '@mui/material';
import { ArrowBackRounded, SendRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const PostWritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .insert({ title: title.trim(), content: content.trim(), author_id: user.id })
      .select().single();
    if (!error && data) navigate(`/posts/${data.id}`);
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 5 } }}>
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/posts')}
        sx={{ color: 'text.secondary', pl: 0, mb: { xs: 2, sm: 3 }, fontSize: '0.85rem' }}
      >
        목록으로
      </Button>

      <Typography
        variant="h5"
        fontWeight={700}
        mb={{ xs: 2.5, sm: 3.5 }}
        sx={{ fontSize: { xs: '1.15rem', sm: '1.35rem' } }}
      >
        새 게시글 작성
      </Typography>

      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          {/* 제목 */}
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              fullWidth
              placeholder="제목을 입력하세요"
              inputProps={{ maxLength: 100 }}
              variant="standard"
              sx={{
                px: { xs: 2.5, sm: 4 },
                pt: { xs: 2, sm: 2.5 },
                pb: 2,
                '& .MuiInput-root': {
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 600,
                  '&::before, &::after': { display: 'none' },
                },
                '& input': { p: 0 },
                '& input::placeholder': { color: 'text.secondary', opacity: 1 },
              }}
            />
          </Box>

          {/* 본문 */}
          <Box>
            <TextField
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              fullWidth
              multiline
              minRows={isMobile ? 10 : 15}
              placeholder="내용을 입력하세요"
              inputProps={{ maxLength: 5000 }}
              variant="standard"
              sx={{
                px: { xs: 2.5, sm: 4 },
                py: { xs: 2, sm: 3 },
                '& .MuiInput-root': {
                  fontSize: { xs: '0.9rem', sm: '0.95rem' },
                  lineHeight: 1.85,
                  '&::before, &::after': { display: 'none' },
                },
                '& textarea': { p: 0 },
                '& textarea::placeholder': { color: 'text.secondary', opacity: 1 },
              }}
            />
          </Box>

          {/* 하단 버튼 영역 */}
          <Box
            sx={{
              px: { xs: 2.5, sm: 4 },
              py: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'rgba(255,255,255,0.02)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {content.length} / 5000
            </Typography>
            <Box display="flex" gap={1.5}>
              <Button
                variant="text"
                onClick={() => navigate('/posts')}
                sx={{ color: 'text.secondary', fontWeight: 500 }}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!title.trim() || !content.trim() || loading}
                endIcon={<SendRounded />}
                sx={{ fontWeight: 700, px: 3 }}
              >
                {loading ? '등록 중...' : '등록'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostWritePage;

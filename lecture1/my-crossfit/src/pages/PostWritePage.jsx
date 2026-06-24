import { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Paper,
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
      .select()
      .single();

    if (!error && data) {
      navigate(`/posts/${data.id}`);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/posts')}
        sx={{ mb: { xs: 2, sm: 3 }, color: 'text.secondary', pl: 0 }}
      >
        목록으로
      </Button>

      <Typography
        variant="h5"
        fontWeight={700}
        mb={{ xs: 2, sm: 3 }}
        sx={{ fontSize: { xs: '1.15rem', sm: '1.5rem' } }}
      >
        새 게시글 작성
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
          <TextField
            label="제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            fullWidth
            inputProps={{ maxLength: 100 }}
            placeholder="제목을 입력하세요"
          />
          <TextField
            label="내용"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            fullWidth
            multiline
            rows={isMobile ? 10 : 14}
            inputProps={{ maxLength: 5000 }}
            placeholder="내용을 입력하세요"
            helperText={`${content.length} / 5000자`}
          />
          <Box
            display="flex"
            justifyContent="flex-end"
            flexDirection={{ xs: 'column-reverse', sm: 'row' }}
            gap={1.5}
          >
            <Button
              variant="outlined"
              onClick={() => navigate('/posts')}
              color="inherit"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!title.trim() || !content.trim() || loading}
              endIcon={<SendRounded />}
              sx={{ fontWeight: 700 }}
            >
              {loading ? '등록 중...' : '게시글 등록'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostWritePage;

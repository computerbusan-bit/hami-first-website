import { useState, useEffect, useCallback } from 'react';
import {
  Container, Box, Typography, Paper, Divider, Button,
  TextField, Avatar, IconButton, Chip, CircularProgress,
  useMediaQuery, useTheme,
} from '@mui/material';
import {
  FavoriteRounded, FavoriteBorderRounded,
  VisibilityRounded, CommentRounded, ArrowBackRounded,
  DeleteRounded, SendRounded,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const PostDetailPage = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(name)')
      .eq('id', id)
      .single();
    setPost(data);
    setLoading(false);
  }, [id]);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(name)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    setComments(data || []);
  }, [id]);

  const fetchLikes = useCallback(async () => {
    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id);
    setLikes(count || 0);

    if (user) {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      setLiked(!!data);
    }
  }, [id, user]);

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchLikes();
    supabase.rpc('increment_view_count', { post_id: parseInt(id) });
  }, [fetchPost, fetchComments, fetchLikes, id]);

  const handleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLikes(prev => prev - 1);
      setLiked(false);
    } else {
      await supabase.from('likes').insert({ post_id: parseInt(id), user_id: user.id });
      setLikes(prev => prev + 1);
      setLiked(true);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setSubmitting(true);
    await supabase.from('comments').insert({
      content: commentText.trim(),
      author_id: user.id,
      post_id: parseInt(id),
    });
    setCommentText('');
    await fetchComments();
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    await supabase.from('comments').delete().eq('id', commentId);
    await fetchComments();
  };

  const handleDeletePost = async () => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    await supabase.from('posts').delete().eq('id', id);
    navigate('/posts');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography color="error">게시글을 찾을 수 없습니다.</Typography>
        <Button onClick={() => navigate('/posts')} startIcon={<ArrowBackRounded />} sx={{ mt: 2 }}>
          목록으로
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/posts')}
        sx={{ mb: { xs: 2, sm: 3 }, color: 'text.secondary', pl: 0 }}
      >
        목록으로
      </Button>

      {/* 게시글 본문 */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          mb: { xs: 2, sm: 3 },
        }}
      >
        {/* 제목 */}
        <Typography
          variant="h5"
          fontWeight={700}
          mb={2.5}
          sx={{ fontSize: { xs: '1.15rem', sm: '1.5rem' }, lineHeight: 1.4 }}
        >
          {post.title}
        </Typography>

        {/* 작성자 정보 + 통계 */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={1.5}
          mb={3}
        >
          <Box display="flex" gap={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 36, height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.85rem',
                color: '#000',
                fontWeight: 700,
              }}
            >
              {post.profiles?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700}>{post.profiles?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{formatDate(post.created_at)}</Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2} alignItems="center">
            <Box display="flex" alignItems="center" gap={0.5}>
              <VisibilityRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{post.view_count}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <CommentRounded sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">{comments.length}</Typography>
            </Box>
            {post.author_id === user?.id && (
              <IconButton
                size="small"
                onClick={handleDeletePost}
                sx={{ color: 'error.main', p: 0.5 }}
              >
                <DeleteRounded sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        <Divider />

        {/* 본문 내용 */}
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.9,
            whiteSpace: 'pre-wrap',
            minHeight: 120,
            py: 3,
            fontSize: { xs: '0.92rem', sm: '1rem' },
          }}
        >
          {post.content}
        </Typography>

        <Divider />

        {/* 좋아요 버튼 */}
        <Box display="flex" justifyContent="center" pt={3}>
          <Button
            variant={liked ? 'contained' : 'outlined'}
            color="primary"
            startIcon={liked ? <FavoriteRounded /> : <FavoriteBorderRounded />}
            onClick={handleLike}
            sx={{ px: { xs: 4, sm: 6 }, py: 1, fontWeight: 700 }}
          >
            좋아요 {likes}
          </Button>
        </Box>
      </Paper>

      {/* 댓글 목록 */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5} mb={3}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            댓글
          </Typography>
          <Chip label={comments.length} color="primary" size="small" sx={{ fontWeight: 700, height: 22 }} />
        </Box>

        {comments.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4} variant="body2">
            첫 댓글을 남겨보세요!
          </Typography>
        ) : (
          <Box>
            {comments.map((comment, idx) => (
              <Box key={comment.id}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  py={2.5}
                >
                  <Box display="flex" gap={1.5} alignItems="flex-start" flex={1} minWidth={0}>
                    <Avatar
                      sx={{
                        width: 30, height: 30,
                        bgcolor: 'primary.dark',
                        fontSize: '0.72rem',
                        color: '#000',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {comment.profiles?.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box flex={1} minWidth={0}>
                      <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" mb={0.75}>
                        <Typography variant="body2" fontWeight={700}>
                          {comment.profiles?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.created_at)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
                      >
                        {comment.content}
                      </Typography>
                    </Box>
                  </Box>
                  {comment.author_id === user?.id && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteComment(comment.id)}
                      sx={{ color: 'text.secondary', ml: 1, flexShrink: 0, p: 0.5 }}
                    >
                      <DeleteRounded sx={{ fontSize: 15 }} />
                    </IconButton>
                  )}
                </Box>
                {idx < comments.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* 댓글 작성 */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700} mb={2}>댓글 작성</Typography>
        <Box
          component="form"
          onSubmit={handleAddComment}
          display="flex"
          gap={{ xs: 1.5, sm: 2 }}
          alignItems="flex-start"
        >
          {!isMobile && (
            <Avatar
              sx={{
                width: 32, height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.8rem',
                color: '#000',
                fontWeight: 700,
                mt: 0.5,
                flexShrink: 0,
              }}
            >
              {(profile?.name?.[0] || user?.email?.[0])?.toUpperCase()}
            </Avatar>
          )}
          <TextField
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            multiline
            rows={2}
            fullWidth
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!commentText.trim() || submitting}
            sx={{ mt: 0.5, minWidth: { xs: 60, sm: 80 }, flexShrink: 0, fontWeight: 700 }}
            endIcon={!isMobile ? <SendRounded /> : undefined}
          >
            {isMobile ? <SendRounded fontSize="small" /> : '등록'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PostDetailPage;

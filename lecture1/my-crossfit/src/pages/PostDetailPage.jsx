import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Divider, Button,
  TextField, Avatar, IconButton, CircularProgress,
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
    const { data } = await supabase.from('posts').select('*, profiles(name)').eq('id', id).single();
    setPost(data);
    setLoading(false);
  }, [id]);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase.from('comments').select('*, profiles(name)')
      .eq('post_id', id).order('created_at', { ascending: true });
    setComments(data || []);
  }, [id]);

  const fetchLikes = useCallback(async () => {
    const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', id);
    setLikes(count || 0);
    if (user) {
      const { data } = await supabase.from('likes').select('id')
        .eq('post_id', id).eq('user_id', user.id).maybeSingle();
      setLiked(!!data);
    }
  }, [id, user]);

  useEffect(() => {
    fetchPost(); fetchComments(); fetchLikes();
    supabase.rpc('increment_view_count', { post_id: parseInt(id) });
  }, [fetchPost, fetchComments, fetchLikes, id]);

  const handleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', id).eq('user_id', user.id);
      setLikes(p => p - 1); setLiked(false);
    } else {
      await supabase.from('likes').insert({ post_id: parseInt(id), user_id: user.id });
      setLikes(p => p + 1); setLiked(true);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    setSubmitting(true);
    await supabase.from('comments').insert({ content: commentText.trim(), author_id: user.id, post_id: parseInt(id) });
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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 2, py: 4 }}>
        <Typography color="error" mb={2}>게시글을 찾을 수 없습니다.</Typography>
        <Button startIcon={<ArrowBackRounded />} onClick={() => navigate('/posts')}>목록으로</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 5 } }}>

      {/* 뒤로가기 */}
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate('/posts')}
        sx={{ color: 'text.secondary', pl: 0, mb: { xs: 2, sm: 3 }, fontSize: '0.85rem' }}
      >
        목록으로
      </Button>

      {/* 게시글 카드 */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: { xs: 2, sm: 3 } }}
      >
        {/* 제목 영역 */}
        <Box sx={{ p: { xs: 2.5, sm: 4 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ fontSize: { xs: '1.1rem', sm: '1.35rem' }, lineHeight: 1.4, mb: 2.5 }}
          >
            {post.title}
          </Typography>

          {/* 메타 정보 */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1.5}
          >
            <Box display="flex" gap={1.5} alignItems="center">
              <Avatar
                sx={{ width: 34, height: 34, bgcolor: 'primary.main', color: '#000', fontSize: '0.82rem', fontWeight: 800 }}
              >
                {post.profiles?.name?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {post.profiles?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(post.created_at)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <VisibilityRounded sx={{ fontSize: 13, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{post.view_count}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <CommentRounded sx={{ fontSize: 13, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">{comments.length}</Typography>
              </Box>
              {post.author_id === user?.id && (
                <IconButton size="small" onClick={handleDeletePost}
                  sx={{ color: 'error.main', p: 0.5, '&:hover': { bgcolor: 'rgba(244,67,54,0.08)' } }}>
                  <DeleteRounded sx={{ fontSize: 17 }} />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        {/* 본문 */}
        <Box sx={{ p: { xs: 2.5, sm: 4 }, minHeight: 160 }}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.85, wordBreak: 'break-word', fontSize: { xs: '0.9rem', sm: '0.97rem' } }}
          >
            {post.content}
          </Typography>
        </Box>

        {/* 좋아요 */}
        <Box sx={{ p: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant={liked ? 'contained' : 'outlined'}
            color="primary"
            startIcon={liked ? <FavoriteRounded /> : <FavoriteBorderRounded />}
            onClick={handleLike}
            sx={{ px: { xs: 4, sm: 6 }, py: 1, fontWeight: 700, borderRadius: 3 }}
          >
            좋아요 {likes}
          </Button>
        </Box>
      </Paper>

      {/* 댓글 영역 */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: { xs: 2, sm: 3 } }}
      >
        {/* 댓글 헤더 */}
        <Box
          sx={{
            px: { xs: 2.5, sm: 4 }, py: 2,
            borderBottom: '1px solid', borderColor: 'divider',
            bgcolor: 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', gap: 1,
          }}
        >
          <CommentRounded sx={{ fontSize: 16, color: 'primary.main' }} />
          <Typography variant="subtitle2" fontWeight={700}>
            댓글 <Box component="span" color="primary.main">{comments.length}</Box>
          </Typography>
        </Box>

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <Box py={5} textAlign="center">
            <Typography variant="body2" color="text.secondary">첫 댓글을 남겨보세요!</Typography>
          </Box>
        ) : (
          comments.map((comment, idx) => (
            <Box
              key={comment.id}
              sx={{
                px: { xs: 2.5, sm: 4 },
                py: 2.5,
                borderBottom: idx < comments.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                <Box display="flex" gap={1.5} flex={1} minWidth={0}>
                  <Avatar
                    sx={{ width: 28, height: 28, bgcolor: 'rgba(0,230,118,0.15)', color: 'primary.main', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0, mt: 0.2 }}
                  >
                    {comment.profiles?.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" flexWrap="wrap" gap={1} alignItems="baseline" mb={0.75}>
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.85rem' }}>
                        {comment.profiles?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.created_at)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.7, fontSize: { xs: '0.85rem', sm: '0.88rem' }, color: 'text.primary' }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
                {comment.author_id === user?.id && (
                  <IconButton size="small" onClick={() => handleDeleteComment(comment.id)}
                    sx={{ color: 'text.secondary', p: 0.5, flexShrink: 0, '&:hover': { color: 'error.main' } }}>
                    <DeleteRounded sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))
        )}

        {/* 댓글 입력 */}
        <Box
          component="form"
          onSubmit={handleAddComment}
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(255,255,255,0.015)',
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start',
          }}
        >
          {!isMobile && (
            <Avatar
              sx={{ width: 30, height: 30, bgcolor: 'primary.main', color: '#000', fontSize: '0.75rem', fontWeight: 800, mt: 0.5, flexShrink: 0 }}
            >
              {(profile?.name?.[0] || user?.email?.[0])?.toUpperCase()}
            </Avatar>
          )}
          <TextField
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요..."
            multiline
            minRows={2}
            maxRows={6}
            fullWidth
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { fontSize: '0.88rem' } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!commentText.trim() || submitting}
            sx={{ mt: 0.5, flexShrink: 0, fontWeight: 700, minWidth: 0, px: { xs: 1.5, sm: 2.5 } }}
          >
            {isMobile ? <SendRounded sx={{ fontSize: 18 }} /> : '등록'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PostDetailPage;

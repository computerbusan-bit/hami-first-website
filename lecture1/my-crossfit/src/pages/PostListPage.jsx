import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress,
  Pagination, Chip, useMediaQuery, useTheme,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow,
} from '@mui/material';
import {
  AddRounded, VisibilityRounded, CommentRounded,
  ChatBubbleOutlineRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const POSTS_PER_PAGE = 10;

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => { fetchPosts(); }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;
    const { data, error, count } = await supabase
      .from('posts')
      .select(`id, title, created_at, view_count, profiles(name), comments!comments_post_id_fkey(count)`, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (!error) { setPosts(data || []); setTotalCount(count || 0); }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffH = diffMs / (1000 * 60 * 60);
    if (diffH < 1) return '방금 전';
    if (diffH < 24) return `${Math.floor(diffH)}시간 전`;
    if (diffH < 48) return '어제';
    return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <Box
      sx={{
        maxWidth: 960,
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        pt: { xs: 3, sm: 5 },
        pb: { xs: 5, sm: 8 },
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* 헤더 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 2.5, sm: 3.5 }}
        pb={{ xs: 2.5, sm: 3 }}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ fontSize: { xs: '1.15rem', sm: '1.35rem' }, mb: 0.4 }}
          >
            커뮤니티 게시판
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
            총 {totalCount}개의 게시글
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRounded />}
          onClick={() => navigate('/posts/write')}
          sx={{ fontWeight: 700, px: 2.5, py: 1, fontSize: '0.88rem', flexShrink: 0 }}
        >
          글쓰기
        </Button>
      </Box>

      {/* 게시글 목록 */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={12}>
          <CircularProgress color="primary" />
        </Box>
      ) : posts.length === 0 ? (
        <Box
          display="flex" flexDirection="column" alignItems="center"
          py={12} gap={2}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
        >
          <ChatBubbleOutlineRounded sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.4 }} />
          <Typography color="text.secondary">아직 게시글이 없습니다</Typography>
          <Button variant="outlined" color="primary" size="small" onClick={() => navigate('/posts/write')}>
            첫 번째 글 작성하기
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {isMobile ? (
            /* 모바일 리스트 */
            <Box>
              {posts.map((post, idx) => {
                const commentCount = post.comments?.[0]?.count ?? 0;
                return (
                  <Box
                    key={post.id}
                    onClick={() => navigate(`/posts/${post.id}`)}
                    sx={{
                      p: 2.5,
                      cursor: 'pointer',
                      borderBottom: idx < posts.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      transition: 'background 0.15s',
                      '&:active': { bgcolor: 'rgba(0,230,118,0.04)' },
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{ mb: 1, lineHeight: 1.4, fontSize: '0.95rem' }}
                    >
                      {post.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                      <Typography variant="caption" color="primary.main" fontWeight={700}>
                        {post.profiles?.name || '알 수 없음'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(post.created_at)}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={0.4} ml="auto">
                        <VisibilityRounded sx={{ fontSize: 11, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">{post.view_count}</Typography>
                        {commentCount > 0 && (
                          <>
                            <CommentRounded sx={{ fontSize: 11, color: 'primary.main', ml: 0.75 }} />
                            <Typography variant="caption" color="primary.main" fontWeight={600}>{commentCount}</Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            /* 데스크탑 테이블 */
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ width: 64, color: 'text.secondary', letterSpacing: 0 }}>NO</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>제목</TableCell>
                    <TableCell align="center" sx={{ width: 100, color: 'text.secondary' }}>작성자</TableCell>
                    <TableCell align="center" sx={{ width: 100, color: 'text.secondary' }}>날짜</TableCell>
                    <TableCell align="center" sx={{ width: 64, color: 'text.secondary' }}>조회</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post, idx) => {
                    const postNumber = totalCount - (page - 1) * POSTS_PER_PAGE - idx;
                    const commentCount = post.comments?.[0]?.count ?? 0;
                    return (
                      <TableRow
                        key={post.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'rgba(0,230,118,0.035)' },
                          '&:hover .post-title': { color: 'primary.main' },
                        }}
                        onClick={() => navigate(`/posts/${post.id}`)}
                      >
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {postNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              className="post-title"
                              variant="body2"
                              fontWeight={500}
                              sx={{ transition: 'color 0.15s', fontSize: '0.92rem' }}
                            >
                              {post.title}
                            </Typography>
                            {commentCount > 0 && (
                              <Typography variant="caption" color="primary.main" fontWeight={700}>
                                [{commentCount}]
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                            {post.profiles?.name || '알 수 없음'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                            {formatDate(post.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                            {post.view_count}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            color="primary"
            shape="rounded"
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}
    </Box>
  );
};

export default PostListPage;

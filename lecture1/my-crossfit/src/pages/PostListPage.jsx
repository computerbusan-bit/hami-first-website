import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination, Chip, CircularProgress,
  Card, CardActionArea, CardContent, useMediaQuery, useTheme,
} from '@mui/material';
import { AddRounded, VisibilityRounded, CommentRounded } from '@mui/icons-material';
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

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from('posts')
      .select(
        `id, title, created_at, view_count,
         profiles(name),
         comments!comments_post_id_fkey(count)`,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('게시글 목록 조회 오류:', error);
    } else {
      setPosts(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isMobile) {
      return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
    }
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const LoadingCell = () => (
    <Box display="flex" justifyContent="center" alignItems="center" py={10}>
      <CircularProgress color="primary" size={36} />
    </Box>
  );

  const EmptyCell = () => (
    <Box textAlign="center" py={10}>
      <Typography color="text.secondary" mb={2}>아직 게시글이 없습니다.</Typography>
      <Button variant="outlined" color="primary" onClick={() => navigate('/posts/write')}>
        첫 번째 글 작성하기
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2.5, sm: 4 }, px: { xs: 2, sm: 3 } }}>
      {/* 헤더 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 2, sm: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.15rem', sm: '1.5rem' } }}>
            커뮤니티 게시판
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            총 {totalCount}개의 게시글
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRounded />}
          onClick={() => navigate('/posts/write')}
          sx={{ px: { xs: 2, sm: 3 }, py: { xs: 0.8, sm: 1 }, fontWeight: 700 }}
        >
          글쓰기
        </Button>
      </Box>

      {/* 모바일: 카드 리스트 */}
      {isMobile ? (
        <Box>
          {loading ? (
            <LoadingCell />
          ) : posts.length === 0 ? (
            <EmptyCell />
          ) : (
            <Box display="flex" flexDirection="column" gap={1.5}>
              {posts.map((post) => {
                const commentCount = post.comments?.[0]?.count ?? 0;
                return (
                  <Card
                    key={post.id}
                    elevation={0}
                    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
                  >
                    <CardActionArea onClick={() => navigate(`/posts/${post.id}`)}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{ flex: 1, lineHeight: 1.4 }}
                          >
                            {post.title}
                          </Typography>
                          {commentCount > 0 && (
                            <Chip
                              label={commentCount}
                              size="small"
                              color="primary"
                              variant="outlined"
                              icon={<CommentRounded />}
                              sx={{ height: 20, fontSize: '0.7rem', flexShrink: 0 }}
                            />
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Typography variant="caption" color="primary.main" fontWeight={600}>
                            {post.profiles?.name || '알 수 없음'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(post.created_at)}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.4} ml="auto">
                            <VisibilityRounded sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {post.view_count}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      ) : (
        /* 데스크탑: 테이블 */
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.03)' }}>
                <TableCell align="center" width={72} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem', borderBottom: '1px solid', borderColor: 'divider' }}>번호</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem', borderBottom: '1px solid', borderColor: 'divider' }}>제목</TableCell>
                <TableCell align="center" width={110} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem', borderBottom: '1px solid', borderColor: 'divider' }}>작성자</TableCell>
                <TableCell align="center" width={120} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem', borderBottom: '1px solid', borderColor: 'divider' }}>작성일</TableCell>
                <TableCell align="center" width={72} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem', borderBottom: '1px solid', borderColor: 'divider' }}>조회</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ border: 0 }}>
                    <LoadingCell />
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ border: 0 }}>
                    <EmptyCell />
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post, idx) => {
                  const postNumber = totalCount - (page - 1) * POSTS_PER_PAGE - idx;
                  const commentCount = post.comments?.[0]?.count ?? 0;
                  return (
                    <TableRow
                      key={post.id}
                      hover
                      sx={{
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        '&:hover': { bgcolor: 'rgba(0, 230, 118, 0.04)' },
                        '&:last-child td': { border: 0 },
                      }}
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">{postNumber}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight={500}>{post.title}</Typography>
                          {commentCount > 0 && (
                            <Chip
                              label={`[${commentCount}]`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ height: 18, fontSize: '0.68rem', borderRadius: 1, px: 0.3 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {post.profiles?.name || '알 수 없음'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(post.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {post.view_count}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={{ xs: 3, sm: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => { setPage(v); window.scrollTo(0, 0); }}
            color="primary"
            shape="rounded"
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
      )}
    </Container>
  );
};

export default PostListPage;

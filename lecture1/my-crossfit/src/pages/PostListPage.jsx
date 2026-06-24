import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Button, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination, Chip, CircularProgress
} from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const POSTS_PER_PAGE = 10;

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
         profiles!posts_author_id_fkey(name),
         comments(count)`,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error) {
      setPosts(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>커뮤니티 게시판</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            총 {totalCount}개의 게시글
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddRounded />}
          onClick={() => navigate('/posts/write')}
        >
          글쓰기
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ border: '1px solid', borderColor: 'divider' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" width={80} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem' }}>번호</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem' }}>제목</TableCell>
              <TableCell align="center" width={120} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem' }}>작성자</TableCell>
              <TableCell align="center" width={130} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem' }}>작성일</TableCell>
              <TableCell align="center" width={80} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.82rem' }}>조회</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <CircularProgress color="primary" size={32} />
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                  아직 게시글이 없습니다. 첫 번째 글을 작성해보세요!
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
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0, 230, 118, 0.04)' } }}
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
                            sx={{ height: 18, fontSize: '0.7rem', borderRadius: 1 }}
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

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
};

export default PostListPage;

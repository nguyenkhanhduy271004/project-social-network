import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Snackbar,
    Alert,
    TextField,
    InputAdornment,
    Container,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Tooltip,
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllPosts, deletePost } from '../../Store/Admin/Action';

const AdminPosts = () => {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector((state) => state.admin);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [postToPreview, setPostToPreview] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(getAllPosts());
        console.log(posts);
    }, [dispatch]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleOpenDeleteDialog = (post) => {
        setPostToDelete(post);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setPostToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deletePost(postToDelete.id));
            setSnackbar({
                open: true,
                message: 'Xóa bài viết thành công!',
                severity: 'success'
            });
            handleCloseDeleteDialog();
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Lỗi: ${error.message}`,
                severity: 'error'
            });
            handleCloseDeleteDialog();
        }
    };

    const handleOpenPreview = (post) => {
        setPostToPreview(post);
        setOpenPreviewDialog(true);
    };

    const handleClosePreview = () => {
        setOpenPreviewDialog(false);
        setPostToPreview(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Filter posts
    const filteredPosts = posts?.filter(post =>
        post.content?.toLowerCase().includes(search.toLowerCase()) ||
        post.user?.fullName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    if (loading && (!posts || posts.length === 0)) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress size={40} />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl">
            <Paper elevation={0} sx={{ p: 3, mt: 2, borderRadius: 2, backgroundColor: 'transparent' }}>
                <Stack spacing={3}>
                    {/* Header Section */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" sx={{
                            fontWeight: 600,
                            color: 'primary.main',
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            pb: 1
                        }}>
                            Quản lý bài viết
                            <Typography component="span" color="text.secondary" sx={{ ml: 1, fontSize: '1rem' }}>
                                ({posts?.length || 0})
                            </Typography>
                        </Typography>
                        <TextField
                            placeholder="Tìm kiếm bài viết hoặc tác giả..."
                            size="small"
                            value={search}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: 'background.paper',
                                    '&:hover': {
                                        '& > fieldset': { borderColor: 'primary.main' }
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* Posts Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Người đăng</TableCell>
                                    <TableCell>Nội dung</TableCell>
                                    <TableCell align="center">Ảnh</TableCell>
                                    <TableCell align="center">Tương tác</TableCell>
                                    <TableCell align="center">Ngày đăng</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPosts
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((post) => (
                                        <TableRow key={post.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        src={post.user?.avatar}
                                                        sx={{ width: 32, height: 32 }}
                                                    >
                                                        {post.user?.fullName?.[0]}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {post.user?.fullName || 'Người dùng ẩn danh'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        maxWidth: '300px'
                                                    }}
                                                >
                                                    {post.content}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {post.image ? (
                                                    <Box
                                                        component="img"
                                                        src={post.image}
                                                        alt="Post thumbnail"
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            objectFit: 'cover',
                                                            borderRadius: 1,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleOpenPreview(post)}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Không có ảnh
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Chip
                                                        size="small"
                                                        label={`${post.likes?.length || 0} 👍`}
                                                        sx={{ minWidth: 70 }}
                                                    />
                                                    <Chip
                                                        size="small"
                                                        label={`${post.comments?.length || 0} 💬`}
                                                        sx={{ minWidth: 70 }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenPreview(post)}
                                                            sx={{ color: 'primary.main' }}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa bài viết">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDeleteDialog(post)}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={filteredPosts.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="Số dòng mỗi trang:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} trên ${count}`
                            }
                        />
                    </TableContainer>
                </Stack>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" color="error">
                        Xác nhận xóa bài viết
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        Bạn có chắc chắn muốn xóa bài viết này?
                    </Typography>
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        Thao tác này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseDeleteDialog}
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        sx={{ borderRadius: 1 }}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Post Preview Dialog */}
            <Dialog
                open={openPreviewDialog}
                onClose={handleClosePreview}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6">Chi tiết bài viết</Typography>
                </DialogTitle>
                <DialogContent>
                    {postToPreview && (
                        <Box sx={{ pt: 2 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Avatar
                                    src={postToPreview.user?.avatar}
                                    alt={postToPreview.user?.fullName}
                                    sx={{
                                        mr: 2,
                                        width: 48,
                                        height: 48,
                                        bgcolor: 'primary.main'
                                    }}
                                >
                                    {postToPreview.user?.fullName?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {postToPreview.user?.fullName || 'Người dùng ẩn danh'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Đăng lúc: {new Date(postToPreview.createdAt).toLocaleString('vi-VN')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {postToPreview.content}
                            </Typography>

                            {postToPreview.image && (
                                <Box mt={2} mb={2} display="flex" justifyContent="center">
                                    <img
                                        src={postToPreview.image}
                                        alt="Post content"
                                        style={{
                                            width: '100%',
                                            maxHeight: '500px',
                                            objectFit: 'contain',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Box>
                            )}

                            <Stack direction="row" spacing={3} mt={2}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    👍 {postToPreview.likes?.length || 0} lượt thích
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    💬 {postToPreview.comments?.length || 0} bình luận
                                </Typography>
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        onClick={handleClosePreview}
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                    >
                        Đóng
                    </Button>
                    <Button
                        onClick={() => {
                            handleClosePreview();
                            handleOpenDeleteDialog(postToPreview);
                        }}
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: 1 }}
                    >
                        Xóa bài viết
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ borderRadius: 1 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminPosts; 
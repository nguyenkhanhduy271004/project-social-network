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
    Card,
    CardMedia
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllStories, deleteStory } from '../../Store/Admin/Action';

const AdminStories = () => {
    const dispatch = useDispatch();
    const { stories, loading } = useSelector((state) => state.admin);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [storyToDelete, setStoryToDelete] = useState(null);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [storyToPreview, setStoryToPreview] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(getAllStories());
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

    const handleOpenDeleteDialog = (story) => {
        setStoryToDelete(story);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setStoryToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteStory(storyToDelete.id));
            setSnackbar({
                open: true,
                message: 'Xóa story thành công!',
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

    const handleOpenPreview = (story) => {
        setStoryToPreview(story);
        setOpenPreviewDialog(true);
    };

    const handleClosePreview = () => {
        setOpenPreviewDialog(false);
        setStoryToPreview(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Filter stories
    const filteredStories = stories?.filter(story =>
        story.content?.toLowerCase().includes(search.toLowerCase()) ||
        story.user?.fullName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    if (loading && (!stories || stories.length === 0)) {
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
                            Quản lý stories
                            <Typography component="span" color="text.secondary" sx={{ ml: 1, fontSize: '1rem' }}>
                                ({stories?.length || 0})
                            </Typography>
                        </Typography>
                        <TextField
                            placeholder="Tìm kiếm story hoặc tác giả..."
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

                    {/* Stories Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Người đăng</TableCell>
                                    <TableCell>Nội dung</TableCell>
                                    <TableCell align="center">Media</TableCell>
                                    <TableCell align="center">Thời gian hết hạn</TableCell>
                                    <TableCell align="center">Ngày đăng</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStories
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((story) => (
                                        <TableRow key={story.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        src={story.user?.avatar}
                                                        sx={{ width: 32, height: 32 }}
                                                    >
                                                        {story.user?.fullName?.[0]}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {story.user?.fullName || 'Người dùng ẩn danh'}
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
                                                    {story.content || "Không có nội dung"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {story.image || story.video ? (
                                                    <Box
                                                        component={story.image ? "img" : "video"}
                                                        src={story.image || story.video}
                                                        alt="Story media"
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            objectFit: 'cover',
                                                            borderRadius: 1,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleOpenPreview(story)}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Không có media
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {story.expirationTime ? new Date(story.expirationTime).toLocaleString('vi-VN') : 'Không rõ'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {new Date(story.createdAt).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleOpenPreview(story)}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa">
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleOpenDeleteDialog(story)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {filteredStories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1">
                                                Không tìm thấy story nào
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredStories.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Số hàng mỗi trang:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                    />
                </Stack>
            </Paper>

            {/* Preview Dialog */}
            <Dialog
                open={openPreviewDialog}
                onClose={handleClosePreview}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Chi tiết Story
                </DialogTitle>
                <DialogContent>
                    {storyToPreview && (
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar src={storyToPreview.user?.avatar}>
                                    {storyToPreview.user?.fullName?.[0]}
                                </Avatar>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {storyToPreview.user?.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                    {new Date(storyToPreview.createdAt).toLocaleString('vi-VN')}
                                </Typography>
                            </Box>

                            {storyToPreview.content && (
                                <Typography variant="body1" sx={{ my: 2 }}>
                                    {storyToPreview.content}
                                </Typography>
                            )}

                            {storyToPreview.image && (
                                <Card>
                                    <CardMedia
                                        component="img"
                                        image={storyToPreview.image}
                                        alt="Story image"
                                        sx={{
                                            maxHeight: '400px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Card>
                            )}

                            {storyToPreview.video && (
                                <Card>
                                    <CardMedia
                                        component="video"
                                        src={storyToPreview.video}
                                        controls
                                        sx={{
                                            maxHeight: '400px',
                                            width: '100%'
                                        }}
                                    />
                                </Card>
                            )}

                            <Typography variant="body2" color="text.secondary">
                                Thời gian hết hạn: {storyToPreview.expirationTime ? new Date(storyToPreview.expirationTime).toLocaleString('vi-VN') : 'Không rõ'}
                            </Typography>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePreview}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa story này? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmDelete}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminStories; 
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
    CardMedia,
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { getAllReels, deleteReel } from '../../Store/Admin/Action';

const AdminReels = () => {
    const dispatch = useDispatch();
    const { reels, loading } = useSelector((state) => state.admin);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [reelToDelete, setReelToDelete] = useState(null);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [reelToPreview, setReelToPreview] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(getAllReels());
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

    const handleOpenDeleteDialog = (reel) => {
        setReelToDelete(reel);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setReelToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteReel(reelToDelete.id));
            setSnackbar({
                open: true,
                message: 'Xóa reel thành công!',
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

    const handleOpenPreview = (reel) => {
        setReelToPreview(reel);
        setOpenPreviewDialog(true);
    };

    const handleClosePreview = () => {
        setOpenPreviewDialog(false);
        setReelToPreview(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Filter reels
    const filteredReels = reels?.filter(reel =>
        reel.title?.toLowerCase().includes(search.toLowerCase()) ||
        reel.content?.toLowerCase().includes(search.toLowerCase()) ||
        reel.user?.fullName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    if (loading && (!reels || reels.length === 0)) {
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
                            Quản lý reels
                            <Typography component="span" color="text.secondary" sx={{ ml: 1, fontSize: '1rem' }}>
                                ({reels?.length || 0})
                            </Typography>
                        </Typography>
                        <TextField
                            placeholder="Tìm kiếm tiêu đề, nội dung hoặc tác giả..."
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

                    {/* Reels Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Người đăng</TableCell>
                                    <TableCell>Tiêu đề/Nội dung</TableCell>
                                    <TableCell align="center">Video</TableCell>
                                    <TableCell align="center">Tương tác</TableCell>
                                    <TableCell align="center">Ngày đăng</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReels
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((reel) => (
                                        <TableRow key={reel.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        src={reel.user?.avatar}
                                                        sx={{ width: 32, height: 32 }}
                                                    >
                                                        {reel.user?.fullName?.[0]}
                                                    </Avatar>
                                                    <Typography variant="body2">
                                                        {reel.user?.fullName || 'Người dùng ẩn danh'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {reel.title && (
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        {reel.title}
                                                    </Typography>
                                                )}
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
                                                    {reel.content || "Không có nội dung"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {reel.image ? (
                                                    <Box
                                                        component="video"
                                                        src={reel.image}
                                                        alt="Reel video"
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            objectFit: 'cover',
                                                            borderRadius: 1,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleOpenPreview(reel)}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Không có video
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Chip
                                                        icon={<ThumbUpIcon fontSize="small" />}
                                                        label={reel.likes?.length || 0}
                                                        size="small"
                                                        sx={{ minWidth: 70 }}
                                                    />
                                                    <Chip
                                                        icon={<CommentIcon fontSize="small" />}
                                                        label={reel.comments?.length || 0}
                                                        size="small"
                                                        sx={{ minWidth: 70 }}
                                                    />
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {new Date(reel.createdAt).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleOpenPreview(reel)}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa">
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleOpenDeleteDialog(reel)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {filteredReels.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1">
                                                Không tìm thấy reel nào
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
                        count={filteredReels.length}
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
                    Chi tiết Reel
                </DialogTitle>
                <DialogContent>
                    {reelToPreview && (
                        <Stack spacing={2} sx={{ pt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar src={reelToPreview.user?.avatar}>
                                    {reelToPreview.user?.fullName?.[0]}
                                </Avatar>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {reelToPreview.user?.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                    {new Date(reelToPreview.createdAt).toLocaleString('vi-VN')}
                                </Typography>
                            </Box>

                            {reelToPreview.title && (
                                <Typography variant="h6">
                                    {reelToPreview.title}
                                </Typography>
                            )}

                            {reelToPreview.content && (
                                <Typography variant="body1" sx={{ my: 2 }}>
                                    {reelToPreview.content}
                                </Typography>
                            )}

                            {reelToPreview.video && (
                                <Card>
                                    <CardMedia
                                        component="video"
                                        src={reelToPreview.video}
                                        controls
                                        sx={{
                                            height: '500px',
                                            width: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </Card>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Chip
                                    icon={<ThumbUpIcon />}
                                    label={`${reelToPreview.likes?.length || 0} lượt thích`}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<CommentIcon />}
                                    label={`${reelToPreview.comments?.length || 0} bình luận`}
                                    color="primary"
                                    variant="outlined"
                                />
                            </Box>
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
                        Bạn có chắc chắn muốn xóa reel này? Hành động này không thể hoàn tác.
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

export default AdminReels; 
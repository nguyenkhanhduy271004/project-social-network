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
import PeopleIcon from '@mui/icons-material/People';
import { getAllGroups, deleteGroup } from '../../Store/Admin/Action';

const AdminGroups = () => {
    const dispatch = useDispatch();
    const { groups, loading } = useSelector((state) => state.admin);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [groupToPreview, setGroupToPreview] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(getAllGroups());
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

    const handleOpenDeleteDialog = (group) => {
        setGroupToDelete(group);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setGroupToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteGroup(groupToDelete.id));
            setSnackbar({
                open: true,
                message: 'Xóa nhóm thành công!',
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

    const handleOpenPreview = (group) => {
        setGroupToPreview(group);
        setOpenPreviewDialog(true);
    };

    const handleClosePreview = () => {
        setOpenPreviewDialog(false);
        setGroupToPreview(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Filter groups
    const filteredGroups = groups?.filter(group =>
        group.name?.toLowerCase().includes(search.toLowerCase()) ||
        group.description?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    // Paginated groups
    const paginatedGroups = filteredGroups.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading && (!groups || groups.length === 0)) {
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
                            Quản lý nhóm
                            <Typography component="span" color="text.secondary" sx={{ ml: 1, fontSize: '1rem' }}>
                                ({groups?.length || 0})
                            </Typography>
                        </Typography>
                        <TextField
                            placeholder="Tìm kiếm nhóm..."
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

                    {/* Groups Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên nhóm</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell align="center">Ảnh nhóm</TableCell>
                                    <TableCell align="center">Số thành viên</TableCell>
                                    <TableCell align="center">Ngày tạo</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedGroups.length > 0 ? (
                                    paginatedGroups.map((group) => (
                                        <TableRow key={group.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar
                                                        src={group.image}
                                                        sx={{ width: 32, height: 32 }}
                                                    >
                                                        {group.name?.[0]}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {group.name}
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
                                                    {group.description || "Không có mô tả"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {group.image ? (
                                                    <Box
                                                        component="img"
                                                        src={group.image}
                                                        alt="Group image"
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            objectFit: 'cover',
                                                            borderRadius: 1,
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => handleOpenPreview(group)}
                                                    />
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Không có ảnh
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    icon={<PeopleIcon fontSize="small" />}
                                                    label={group.members?.length || 0}
                                                    color="primary"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2">
                                                    {new Date(group.createdAt).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleOpenPreview(group)}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa nhóm">
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleOpenDeleteDialog(group)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body1" py={3}>
                                                Không tìm thấy nhóm nào
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredGroups.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Stack>
            </Paper>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
            >
                <DialogTitle>Xác nhận xóa nhóm</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa nhóm "{groupToDelete?.name}"? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Preview Dialog */}
            {groupToPreview && (
                <Dialog
                    open={openPreviewDialog}
                    onClose={handleClosePreview}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Chi tiết nhóm
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ p: 2 }}>
                            <Box display="flex" alignItems="center" mb={3}>
                                <Avatar
                                    src={groupToPreview.image}
                                    sx={{ width: 80, height: 80, mr: 2 }}
                                >
                                    {groupToPreview.name?.[0]}
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">
                                        {groupToPreview.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tạo ngày: {new Date(groupToPreview.createdAt).toLocaleDateString('vi-VN')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="h6" fontWeight="bold" mt={2}>
                                Mô tả
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {groupToPreview.description || "Không có mô tả"}
                            </Typography>

                            <Typography variant="h6" fontWeight="bold" mt={2}>
                                Thông tin nhóm
                            </Typography>
                            <Typography variant="body1">
                                Số thành viên: {groupToPreview.members?.length || 0}
                            </Typography>
                            <Typography variant="body1">
                                Số bài viết: {groupToPreview.posts?.length || 0}
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePreview}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminGroups; 
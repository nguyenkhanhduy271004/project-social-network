import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
    TablePagination,
    TextField,
    InputAdornment,
    IconButton,
    Switch,
    FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { getAllUsers, updateUserAdminStatus, deleteUser } from '../../Store/Admin/Action';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.admin);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [openAdminDialog, setOpenAdminDialog] = useState(false);
    const [userToUpdateAdmin, setUserToUpdateAdmin] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(getAllUsers());
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

    const handleOpenDeleteDialog = (user) => {
        setUserToDelete(user);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setUserToDelete(null);
    };

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteUser(userToDelete.id));
            setSnackbar({
                open: true,
                message: 'Xóa người dùng thành công!',
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

    const handleOpenAdminDialog = (user) => {
        setUserToUpdateAdmin(user);
        setOpenAdminDialog(true);
    };

    const handleCloseAdminDialog = () => {
        setOpenAdminDialog(false);
        setUserToUpdateAdmin(null);
    };

    const handleConfirmAdminUpdate = async () => {
        try {
            await dispatch(updateUserAdminStatus(
                userToUpdateAdmin.id,
                !userToUpdateAdmin.admin
            ));
            setSnackbar({
                open: true,
                message: `${userToUpdateAdmin.admin ? 'Hủy' : 'Cấp'} quyền quản trị thành công!`,
                severity: 'success'
            });
            handleCloseAdminDialog();
        } catch (error) {
            setSnackbar({
                open: true,
                message: `Lỗi: ${error.message}`,
                severity: 'error'
            });
            handleCloseAdminDialog();
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Filter users
    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    );

    // Paginate users
    const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading && users.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box mt={4}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Quản lý người dùng ({users.length})
                </Typography>
                <TextField
                    placeholder="Tìm kiếm người dùng"
                    size="small"
                    value={search}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 300 }}
                />
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell>
                                        <Avatar src={user.avatar} alt={user.fullName}>
                                            {user.fullName?.[0]}
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            {user.admin ? (
                                                <>
                                                    <AdminPanelSettingsIcon sx={{ color: 'primary.main', mr: 1 }} />
                                                    <Typography color="primary.main">Admin</Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                                    <Typography color="text.secondary">Người dùng</Typography>
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            {user.id !== currentUser?.id && (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color={user.admin ? "warning" : "primary"}
                                                        onClick={() => handleOpenAdminDialog(user)}
                                                        startIcon={<AdminPanelSettingsIcon />}
                                                        sx={{ borderRadius: '20px' }}
                                                    >
                                                        {user.admin ? 'Hủy Admin' : 'Cấp Admin'}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenDeleteDialog(user)}
                                                        startIcon={<DeleteIcon />}
                                                        sx={{ borderRadius: '20px' }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </>
                                            )}
                                            {user.id === currentUser?.id && (
                                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    Tài khoản hiện tại
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography variant="body1" sx={{ py: 2 }}>
                                        Không tìm thấy người dùng nào
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                />
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.fullName}</strong>?
                        <br />
                        Thao tác này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan đến người dùng này.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Admin Status Dialog */}
            <Dialog open={openAdminDialog} onClose={handleCloseAdminDialog}>
                <DialogTitle>
                    {userToUpdateAdmin?.admin
                        ? 'Xác nhận hủy quyền quản trị'
                        : 'Xác nhận cấp quyền quản trị'}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {userToUpdateAdmin?.admin
                            ? `Bạn có chắc chắn muốn hủy quyền quản trị của người dùng ${userToUpdateAdmin?.fullName}?`
                            : `Bạn có chắc chắn muốn cấp quyền quản trị cho người dùng ${userToUpdateAdmin?.fullName}?`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdminDialog}>Hủy</Button>
                    <Button
                        onClick={handleConfirmAdminUpdate}
                        color={userToUpdateAdmin?.admin ? "warning" : "primary"}
                        variant="contained"
                    >
                        {userToUpdateAdmin?.admin ? 'Hủy quyền' : 'Cấp quyền'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminUsers; 
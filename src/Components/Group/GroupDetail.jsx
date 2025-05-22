import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    Avatar,
    Paper,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Fade,
    Zoom,
    Divider,
    Alert,
    Snackbar,
    Chip,
    TextField
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { getGroupById, updateGroup, deleteGroup } from '../../Store/Group/Action';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const DEFAULT_GROUP_IMAGE = 'https://img.icons8.com/?size=100&id=pETkiIKt6qBf&format=png&color=000000';

function GroupDetail() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { user } = useSelector(state => state.auth);
    const { currentGroup, loading } = useSelector(state => state.group);

    const [anchorEl, setAnchorEl] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const styles = useMemo(() => ({
        container: {
            maxWidth: '1200px',
            mx: 'auto',
            p: { xs: 2, md: 4 }
        },
        header: {
            position: 'relative',
            height: 300,
            mb: 4,
            borderRadius: 2,
            overflow: 'hidden'
        },
        headerImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        headerOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            color: 'white'
        },
        groupInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2
        },
        groupAvatar: {
            width: 80,
            height: 80,
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        },
        groupName: {
            fontWeight: 600,
            fontSize: '2rem',
            mb: 1
        },
        groupDescription: {
            color: 'rgba(255,255,255,0.9)',
            mb: 2
        },
        groupStats: {
            display: 'flex',
            gap: 3
        },
        statItem: {
            display: 'flex',
            alignItems: 'center',
            gap: 1
        },
        content: {
            display: 'flex',
            gap: 4
        },
        mainContent: {
            flex: 1
        },
        sidebar: {
            width: 300
        },
        infoCard: {
            p: 3,
            mb: 3,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        },
        memberCard: {
            p: 2,
            mb: 2,
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        },
        actionButton: {
            borderRadius: '20px',
            textTransform: 'none',
            px: 3
        }
    }), [isDarkMode]);

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            image: null
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên nhóm là bắt buộc'),
            description: Yup.string().required('Mô tả là bắt buộc')
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                await dispatch(updateGroup(groupId, values));
                setSuccessMessage('Cập nhật nhóm thành công');
                setOpenEditDialog(false);
            } catch (error) {
                setErrorMessage(error.message || 'Có lỗi xảy ra khi cập nhật nhóm');
            } finally {
                setIsSubmitting(false);
            }
        }
    });

    useEffect(() => {
        if (groupId) {
            dispatch(getGroupById(groupId));
        }
    }, [dispatch, groupId]);

    useEffect(() => {
        if (currentGroup) {
            formik.setValues({
                name: currentGroup.name,
                description: currentGroup.description,
                image: null
            });
        }
    }, [currentGroup]);

    const handleEditGroup = useCallback(() => {
        setOpenEditDialog(true);
        setAnchorEl(null);
    }, []);

    const handleDeleteGroup = useCallback(async () => {
        try {
            await dispatch(deleteGroup(groupId));
            setSuccessMessage('Xóa nhóm thành công');
            navigate('/groups');
        } catch (error) {
            setErrorMessage(error.message || 'Có lỗi xảy ra khi xóa nhóm');
        }
        setOpenDeleteDialog(false);
    }, [dispatch, groupId, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!currentGroup) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h5" color="error">
                    Không tìm thấy nhóm
                </Typography>
            </Box>
        );
    }

    const isAdmin = currentGroup.admin?.id === user?.id;

    return (
        <Box sx={styles.container}>
            <Box sx={styles.header}>
                <img
                    src={currentGroup.image || DEFAULT_GROUP_IMAGE}
                    alt={currentGroup.name}
                    style={styles.headerImage}
                />
                <Box sx={styles.headerOverlay}>
                    <Box sx={styles.groupInfo}>
                        <Avatar
                            src={currentGroup.image || DEFAULT_GROUP_IMAGE}
                            sx={styles.groupAvatar}
                        />
                        <Box>
                            <Typography variant="h4" sx={styles.groupName}>
                                {currentGroup.name}
                            </Typography>
                            <Typography variant="body1" sx={styles.groupDescription}>
                                {currentGroup.description}
                            </Typography>
                        </Box>
                        {isAdmin && (
                            <IconButton
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                sx={{ color: 'white' }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Box sx={styles.groupStats}>
                        <Box sx={styles.statItem}>
                            <GroupIcon />
                            <Typography variant="body2">
                                {currentGroup.memberCount} thành viên
                            </Typography>
                        </Box>
                        <Box sx={styles.statItem}>
                            <PersonIcon />
                            <Typography variant="body2">
                                {currentGroup.adminCount} quản trị viên
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={styles.content}>
                <Box sx={styles.mainContent}>
                    <Paper sx={styles.infoCard}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Thông tin nhóm
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Ngày tạo
                                </Typography>
                                <Typography variant="body1">
                                    {new Date(currentGroup.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Trạng thái
                                </Typography>
                                <Chip
                                    label={currentGroup.isPublic ? 'Công khai' : 'Riêng tư'}
                                    color={currentGroup.isPublic ? 'success' : 'default'}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>

                <Box sx={styles.sidebar}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Thành viên
                        </Typography>
                        {currentGroup.members?.map((member) => (
                            <Paper
                                key={member.id}
                                sx={styles.memberCard}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        src={member.image}
                                        alt={member.fullName}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            },
                                            transition: 'transform 0.2s ease'
                                        }}
                                        onClick={() => navigate(`/profile/${member.id}`)}
                                    />
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                            {member.fullName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {member.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Paper>
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={handleEditGroup}>
                    <EditIcon sx={{ mr: 1 }} /> Chỉnh sửa
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setOpenDeleteDialog(true);
                        setAnchorEl(null);
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon sx={{ mr: 1 }} /> Xóa
                </MenuItem>
            </Menu>

            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Chỉnh sửa nhóm</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            label="Tên nhóm"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            name="description"
                            multiline
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            sx={{ mt: 2 }}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
                    <Button
                        onClick={formik.handleSubmit}
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={24} />
                        ) : (
                            'Lưu'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Xác nhận xóa nhóm</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa nhóm này? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleDeleteGroup}
                        color="error"
                        variant="contained"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!successMessage || !!errorMessage}
                autoHideDuration={3000}
                onClose={() => {
                    setSuccessMessage('');
                    setErrorMessage('');
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => {
                        setSuccessMessage('');
                        setErrorMessage('');
                    }}
                    severity={successMessage ? 'success' : 'error'}
                    variant="filled"
                >
                    {successMessage || errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default React.memo(GroupDetail);

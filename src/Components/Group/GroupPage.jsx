import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    TextField,
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
    Chip
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Send as SendIcon,
    Image as ImageIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { getGroupById, createPostInGroup, deleteGroup, updateGroup } from '../../Store/Group/Action';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const DEFAULT_GROUP_IMAGE = 'https://img.icons8.com/?size=100&id=pETkiIKt6qBf&format=png&color=000000';

function GroupPage() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { user } = useSelector(state => state.auth);
    const { currentGroup, loading } = useSelector(state => state.group);

    const [anchorEl, setAnchorEl] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

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
        postForm: {
            p: 3,
            mb: 4,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        },
        postCard: {
            p: 3,
            mb: 3,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        },
        postHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2
        },
        postUser: {
            display: 'flex',
            alignItems: 'center',
            gap: 2
        },
        postContent: {
            mb: 2,
            whiteSpace: 'pre-wrap'
        },
        postImage: {
            width: '100%',
            maxHeight: 500,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 2
        },
        postActions: {
            display: 'flex',
            gap: 2,
            color: 'text.secondary'
        },
        actionButton: {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
                color: 'primary.main'
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
        }
    }), [isDarkMode]);

    const formik = useFormik({
        initialValues: {
            content: '',
            image: null
        },
        validationSchema: Yup.object({
            content: Yup.string().required('Nội dung không được để trống'),
            image: Yup.mixed()
                .test('fileSize', 'Kích thước file quá lớn (tối đa 5MB)', (value) => {
                    if (!value) return true;
                    return value.size <= 5000000;
                })
        }),
        onSubmit: handleCreatePost
    });

    useEffect(() => {
        if (groupId) {
            dispatch(getGroupById(groupId));
        }
    }, [dispatch, groupId]);

    const handleImageSelect = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            formik.setFieldValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, [formik]);

    const handleRemoveImage = useCallback(() => {
        setSelectedImage(null);
        formik.setFieldValue('image', null);
    }, [formik]);

    const handleEditPost = useCallback((post) => {
        setSelectedPost(post);
        setOpenEditDialog(true);
    }, []);

    const handleCreatePost = useCallback(async (values) => {
        setIsSubmitting(true);
        try {
            await dispatch(createPostInGroup({
                groupId,
                content: values.content,
                image: values.image
            }));
            formik.resetForm();
            setSelectedImage(null);
            setSuccessMessage('Đăng bài thành công');
        } catch (error) {
            setErrorMessage(error.message || 'Có lỗi xảy ra khi đăng bài');
        } finally {
            setIsSubmitting(false);
        }
    }, [dispatch, groupId, formik]);

    const handleDeletePost = useCallback(async (postId) => {
        try {
            await dispatch(deleteGroup(postId));
            setSuccessMessage('Xóa bài viết thành công');
        } catch (error) {
            setErrorMessage(error.message || 'Có lỗi xảy ra khi xóa bài viết');
        }
        setAnchorEl(null);
    }, [dispatch]);

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
                    </Box>
                    <Box sx={styles.groupStats}>
                        <Box sx={styles.statItem}>
                            <Typography variant="body2">
                                {currentGroup.memberCount} thành viên
                            </Typography>
                        </Box>
                        <Box sx={styles.statItem}>
                            <Typography variant="body2">
                                {currentGroup.postCount} bài viết
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={styles.content}>
                <Box sx={styles.mainContent}>
                    <Paper sx={styles.postForm}>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Viết gì đó cho nhóm..."
                                name="content"
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                error={formik.touched.content && Boolean(formik.errors.content)}
                                helperText={formik.touched.content && formik.errors.content}
                                sx={{ mb: 2 }}
                            />

                            {selectedImage && (
                                <Fade in={true}>
                                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                        <img
                                            src={selectedImage}
                                            alt="Selected"
                                            style={{
                                                maxWidth: '300px',
                                                maxHeight: '300px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={handleRemoveImage}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'rgba(0,0,0,0.6)',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'rgba(0,0,0,0.8)'
                                                }
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Fade>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        style={{ display: 'none' }}
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload">
                                        <IconButton
                                            component="span"
                                            color="primary"
                                            sx={{
                                                '&:hover': {
                                                    transform: 'scale(1.1)'
                                                },
                                                transition: 'transform 0.2s ease'
                                            }}
                                        >
                                            <ImageIcon />
                                        </IconButton>
                                    </label>
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting || !formik.values.content.trim()}
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                                >
                                    {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
                                </Button>
                            </Box>
                        </form>
                    </Paper>

                    {currentGroup.posts?.map((post) => (
                        <Zoom in={true} key={post.id}>
                            <Paper sx={styles.postCard}>
                                <Box sx={styles.postHeader}>
                                    <Box sx={styles.postUser}>
                                        <Avatar
                                            src={post.user?.image}
                                            alt={post.user?.fullName}
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform: 'scale(1.1)'
                                                },
                                                transition: 'transform 0.2s ease'
                                            }}
                                            onClick={() => navigate(`/profile/${post.user?.id}`)}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {post.user?.fullName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {post.user?.id === user?.id && (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => setAnchorEl(e.currentTarget)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    )}
                                </Box>

                                <Typography variant="body1" sx={styles.postContent}>
                                    {post.content}
                                </Typography>

                                {post.image && (
                                    <Fade in={true}>
                                        <img
                                            src={post.image}
                                            alt="Post content"
                                            style={styles.postImage}
                                        />
                                    </Fade>
                                )}

                                <Box sx={styles.postActions}>
                                    <Box sx={styles.actionButton}>
                                        <span>❤️</span>
                                        <Typography variant="body2">
                                            {post.totalLikes || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={styles.actionButton}>
                                        <span>💬</span>
                                        <Typography variant="body2">
                                            {post.totalComments || 0}
                                        </Typography>
                                    </Box>
                                    <Box sx={styles.actionButton}>
                                        <span>🔁</span>
                                        <Typography variant="body2">
                                            {post.totalReplies || 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Zoom>
                    ))}
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
                <MenuItem onClick={() => {
                    handleEditPost(selectedPost);
                    setAnchorEl(null);
                }}>
                    <EditIcon sx={{ mr: 1 }} /> Chỉnh sửa
                </MenuItem>
                <MenuItem
                    onClick={() => handleDeletePost(selectedPost?.id)}
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
                <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={selectedPost?.content}
                        onChange={(e) => setSelectedPost(prev => ({ ...prev, content: e.target.value }))}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
                    <Button
                        onClick={() => {
                            dispatch(updateGroup(selectedPost.id, { content: selectedPost.content }));
                            setOpenEditDialog(false);
                        }}
                        variant="contained"
                    >
                        Lưu
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

export default React.memo(GroupPage);

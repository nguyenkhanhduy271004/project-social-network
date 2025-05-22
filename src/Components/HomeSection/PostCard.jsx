import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Menu, MenuItem, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Box, Typography, Snackbar, Alert, CircularProgress, Fade, Zoom } from '@mui/material';
import { MoreHoriz, Send, Edit, Delete } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useNavigate } from 'react-router-dom';
import ErrorDisplay from '../Common/ErrorDisplay';
import { deletePost, likePost, createComment, createRePost, editPost, getComments } from '../../Store/Post/Action';
import PropTypes from 'prop-types';
import { useTheme } from '../../theme/ThemeContext';
import { api } from '../../config/api';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/150';
const DEFAULT_USERNAME = 'Unknown User';

const formatUsername = (fullName) =>
    fullName?.replace(/\s+/g, '_').toLowerCase() || 'unknown_user';

function PostCard({ post }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(store => store.auth.user);
    const likedPosts = useSelector(store => store.post.likedPosts);
    const reduxComments = useSelector(state => state.post.commentPost?.[post?.id] ?? []);
    const { isDarkMode } = useTheme();

    const [isLiked, setIsLiked] = useState(likedPosts.some(likedPost => likedPost.id === post.id));
    const [totalLikes, setTotalLikes] = useState(post?.totalLikes || 0);
    const [totalComments, setTotalComments] = useState(post?.totalComments || 0);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editedContent, setEditedContent] = useState(post?.content || "");
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [commentAnchorEl, setCommentAnchorEl] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [editCommentModal, setEditCommentModal] = useState(false);
    const [editedCommentContent, setEditedCommentContent] = useState('');
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (post?.id) {
            dispatch(getComments(post.id));
        }
    }, [dispatch, post?.id]);

    useEffect(() => {
        setComments(Array.isArray(reduxComments) ? reduxComments : []);
    }, [reduxComments]);

    const handleLikePost = useCallback(() => {
        try {
            dispatch(likePost(post?.id));
            setIsLiked(prev => !prev);
            setTotalLikes(prev => (isLiked ? prev - 1 : prev + 1));
        } catch (err) {
            setError('Không thể thực hiện thao tác like. Vui lòng thử lại.');
        }
    }, [dispatch, post?.id, isLiked]);

    const handleCommentSubmit = useCallback(async () => {
        if (!comment.trim()) return;
        setIsLoading(true);
        try {
            await dispatch(createComment({ content: comment, postId: post?.id }));
            setComments(prev => [...prev, { user, content: comment }]);
            setTotalComments(prev => prev + 1);
            setComment('');
        } catch (err) {
            setError('Không thể đăng bình luận. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [comment, dispatch, post?.id, user]);

    const handleSharePost = useCallback(() => {
        try {
            dispatch(createRePost(post?.id));
        } catch (err) {
            setError('Không thể chia sẻ bài viết. Vui lòng thử lại.');
        }
    }, [dispatch, post?.id]);

    const handleEditPost = () => {
        setOpenEditModal(true);
        setAnchorEl(null);
    };

    const handleSaveEdit = () => {
        dispatch(editPost(post?.id, { content: editedContent, postId: post?.id }));
        setOpenEditModal(false);
    };

    const userDisplayName = useMemo(() => {
        return post?.user?.fullName || 'Unknown User';
    }, [post?.user?.fullName]);

    useEffect(() => {
        setEditedContent(post?.content || "");
    }, [post?.content]);

    const handleCloseSnackbar = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleEditComment = async () => {
        if (!editedCommentContent.trim()) {
            setErrorMessage('Nội dung bình luận không được để trống');
            return;
        }

        if (!selectedComment?.id) {
            setErrorMessage('Không thể xác định bình luận cần chỉnh sửa');
            return;
        }

        setIsCommentLoading(true);
        try {
            const response = await api.put(`/api/posts/${selectedComment.id}/comment`, {
                commentId: selectedComment.id,
                postId: post?.id,
                content: editedCommentContent
            });

            if (response.status === 200 && response.data) {
                const updatedComment = response.data.data;
                setComments(prevComments =>
                    prevComments.map(c =>
                        c.id === selectedComment.id
                            ? { ...c, content: editedCommentContent, updatedAt: new Date().toISOString() }
                            : c
                    )
                );
                setEditCommentModal(false);
                setCommentAnchorEl(null);
                setSuccessMessage('Bình luận đã được cập nhật thành công');
            }
        } catch (err) {
            console.error('Edit comment error:', err);
            setErrorMessage(err.response?.data?.message || 'Đã xảy ra lỗi khi chỉnh sửa bình luận');
        } finally {
            setIsCommentLoading(false);
        }
    };

    const handleDeleteComment = async () => {
        if (!selectedComment?.id) {
            setErrorMessage('Không thể xác định bình luận cần xóa');
            return;
        }

        setIsCommentLoading(true);
        try {
            const response = await api.delete(`/api/posts/${selectedComment.id}/comment`);

            if (response.status === 204) {
                setComments(prevComments => prevComments.filter(c => c.id !== selectedComment.id));
                setTotalComments(prev => prev - 1);
                setCommentAnchorEl(null);
                setSuccessMessage('Bình luận đã được xóa thành công');
            }
        } catch (err) {
            console.error('Delete comment error:', err);
            setErrorMessage(err.response?.data?.message || 'Đã xảy ra lỗi khi xóa bình luận');
        } finally {
            setIsCommentLoading(false);
        }
    };

    const cardStyles = useMemo(() => ({
        p: 3,
        mb: 3,
        borderRadius: 2,
        backgroundColor: isDarkMode ? 'background.paper' : 'white',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
        color: isDarkMode ? 'text.primary' : 'inherit',
        '&:hover': {
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'inherit',
            boxShadow: isDarkMode ? '0 0 10px rgba(255, 255, 255, 0.1)' : 'inherit',
            transform: 'translateY(-2px)'
        },
        transition: 'all 0.3s ease'
    }), [isDarkMode]);

    const avatarStyles = useMemo(() => ({
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        '&:hover': {
            transform: 'scale(1.1)'
        }
    }), []);

    const actionButtonStyles = useMemo(() => ({
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'scale(1.1)'
        }
    }), []);

    const commentStyles = useMemo(() => ({
        display: 'flex',
        gap: 2,
        mb: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'grey.100',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'grey.200'
        }
    }), [isDarkMode]);

    if (error) {
        return (
            <ErrorDisplay
                message={error}
                onRetry={() => setError(null)}
            />
        );
    }

    return (
        <Paper elevation={3} sx={cardStyles}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar
                    onClick={() => navigate(`/profile/${post?.user?._id}`)}
                    src={post?.user?.image || PLACEHOLDER_IMAGE}
                    sx={avatarStyles}
                />
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 600,
                                    color: isDarkMode ? 'text.primary' : 'inherit',
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                {post?.user?.fullName || DEFAULT_USERNAME}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isDarkMode ? 'text.secondary' : 'text.secondary',
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                @{formatUsername(post?.user?.fullName)} · 2m
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{
                                transition: 'transform 0.2s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            <MoreHoriz sx={{ color: isDarkMode ? 'text.primary' : 'inherit' }} />
                        </IconButton>
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{
                            mb: 2,
                            color: isDarkMode ? 'text.primary' : 'inherit',
                            whiteSpace: 'pre-wrap',
                            transition: 'color 0.2s ease'
                        }}
                    >
                        {post?.content}
                    </Typography>

                    {post?.image && (
                        <Fade in={true}>
                            <Box
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                            >
                                <img
                                    src={post.image}
                                    alt="Post content"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                            </Box>
                        </Fade>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            color: isDarkMode ? 'text.secondary' : 'text.secondary'
                        }}
                    >
                        <Box
                            sx={actionButtonStyles}
                            onClick={() => setShowComments(!showComments)}
                        >
                            <ChatBubbleOutlineIcon fontSize="small" />
                            <Typography variant="body2">{totalComments}</Typography>
                        </Box>

                        <Box
                            sx={{
                                ...actionButtonStyles,
                                color: isLiked ? 'error.main' : 'inherit',
                                '&:hover': {
                                    color: 'error.main'
                                }
                            }}
                            onClick={handleLikePost}
                        >
                            {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                            <Typography variant="body2">{totalLikes}</Typography>
                        </Box>

                        <Box
                            sx={actionButtonStyles}
                            onClick={handleSharePost}
                        >
                            <RepeatIcon fontSize="small" />
                        </Box>
                    </Box>

                    {showComments && (
                        <Fade in={true}>
                            <Box sx={{ mt: 2 }}>
                                {comments.map((comment, index) => (
                                    <Box
                                        key={index}
                                        sx={commentStyles}
                                    >
                                        <Avatar
                                            src={comment.user?.image || PLACEHOLDER_IMAGE}
                                            sx={{
                                                transition: 'transform 0.2s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.1)'
                                                }
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: isDarkMode ? 'text.primary' : 'inherit',
                                                        transition: 'color 0.2s ease'
                                                    }}
                                                >
                                                    {comment.user?.fullName || DEFAULT_USERNAME}
                                                </Typography>
                                                {comment.user?.id === user?.id && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            setSelectedComment(comment);
                                                            setCommentAnchorEl(e.currentTarget);
                                                        }}
                                                        sx={{
                                                            transition: 'transform 0.2s ease',
                                                            '&:hover': {
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <MoreHoriz sx={{ color: isDarkMode ? 'text.primary' : 'inherit' }} />
                                                    </IconButton>
                                                )}
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: isDarkMode ? 'text.primary' : 'inherit',
                                                    transition: 'color 0.2s ease'
                                                }}
                                            >
                                                {comment.content}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Viết bình luận..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'inherit',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'inherit'
                                                }
                                            }
                                        }}
                                    />
                                    <IconButton
                                        onClick={handleCommentSubmit}
                                        disabled={!comment.trim() || isLoading}
                                        color="primary"
                                        sx={{
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : <Send />}
                                    </IconButton>
                                </Box>
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    sx: {
                        backgroundColor: isDarkMode ? 'background.paper' : 'white',
                        color: isDarkMode ? 'text.primary' : 'inherit'
                    }
                }}
            >
                <MenuItem onClick={() => {
                    dispatch(deletePost(post?.id));
                    setAnchorEl(null);
                }}>Xóa bài</MenuItem>
                <MenuItem onClick={() => {
                    setOpenEditModal(true);
                    setAnchorEl(null);
                }}>Chỉnh sửa</MenuItem>
            </Menu>

            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: isDarkMode ? 'background.paper' : 'white',
                        color: isDarkMode ? 'text.primary' : 'inherit'
                    }
                }}
            >
                <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        sx={{
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'inherit'
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditModal(false)}>Hủy</Button>
                    <Button onClick={handleSaveEdit} color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>

            <Menu
                anchorEl={commentAnchorEl}
                open={Boolean(commentAnchorEl)}
                onClose={() => setCommentAnchorEl(null)}
                PaperProps={{
                    sx: {
                        backgroundColor: isDarkMode ? 'background.paper' : 'white',
                        color: isDarkMode ? 'text.primary' : 'inherit'
                    }
                }}
            >
                <MenuItem
                    onClick={() => {
                        setEditedCommentContent(selectedComment?.content || '');
                        setEditCommentModal(true);
                        setCommentAnchorEl(null);
                    }}
                    disabled={isCommentLoading}
                >
                    <Edit sx={{ mr: 1 }} fontSize="small" />
                    Chỉnh sửa
                </MenuItem>
                <MenuItem
                    onClick={handleDeleteComment}
                    disabled={isCommentLoading}
                    sx={{ color: 'error.main' }}
                >
                    <Delete sx={{ mr: 1 }} fontSize="small" />
                    Xóa
                </MenuItem>
            </Menu>

            <Dialog
                open={editCommentModal}
                onClose={() => !isCommentLoading && setEditCommentModal(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: isDarkMode ? 'background.paper' : 'white',
                        color: isDarkMode ? 'text.primary' : 'inherit',
                        minWidth: { xs: '90%', sm: '500px' }
                    }
                }}
            >
                <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={editedCommentContent}
                        onChange={(e) => setEditedCommentContent(e.target.value)}
                        disabled={isCommentLoading}
                        error={!editedCommentContent.trim()}
                        helperText={!editedCommentContent.trim() ? 'Nội dung không được để trống' : ''}
                        sx={{
                            mt: 2,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'inherit'
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setEditCommentModal(false)}
                        disabled={isCommentLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleEditComment}
                        color="primary"
                        disabled={isCommentLoading || !editedCommentContent.trim()}
                        startIcon={isCommentLoading ? <CircularProgress size={20} /> : null}
                    >
                        {isCommentLoading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!successMessage || !!errorMessage}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={successMessage ? 'success' : 'error'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {successMessage || errorMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
}

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.string.isRequired,
        content: PropTypes.string,
        image: PropTypes.string,
        user: PropTypes.shape({
            id: PropTypes.string,
            fullName: PropTypes.string,
            image: PropTypes.string
        }),
        totalLikes: PropTypes.number,
        totalComments: PropTypes.number
    }).isRequired
};

export default React.memo(PostCard);

// Tách render logic thành các functions riêng
const renderHeader = () => {
    // header render logic
};

const renderContent = () => {
    // content render logic
};

const renderActions = () => {
    // actions render logic
};
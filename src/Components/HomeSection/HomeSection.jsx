import { Avatar, Button, IconButton, Paper, Typography, Box, CircularProgress, Tooltip, Fade } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState, useMemo } from 'react';
import * as Yup from 'yup';
import ImageIcon from '@mui/icons-material/Image';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import CloseIcon from '@mui/icons-material/Close';
import PostCard from './PostCard';
import StorySlider from '../StorySlider/StorySlider';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, findPostsByLikeContainUser, getAllPosts } from '../../Store/Post/Action';
import PropTypes from 'prop-types';
import { PostSkeleton } from '../Common/LoadingStates';

const POST_VALIDATION_SCHEMA = Yup.object({
    content: Yup.string()
        .required("Nội dung không được để trống")
        .max(500, "Nội dung không được vượt quá 500 ký tự"),
    image: Yup.mixed()
        .test("fileSize", "Kích thước file quá lớn (tối đa 5MB)", (value) => {
            if (!value) return true;
            return value.size <= 5000000;
        })
});

const EMOJIS = ["😃", "😂", "😍", "🤔", "😭", "😎", "🥰", "😡", "👍", "🔥", "❤️", "🎉", "✨", "🌟", "💫"];
const DEFAULT_AVATAR = "https://img.icons8.com/?size=100&id=pETkiIKt6qBf&format=png&color=000000";

function HomeSection() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { posts, loading } = useSelector(state => state.post);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const buttonStyles = useMemo(() => ({
        borderRadius: "25px",
        px: 3,
        py: 1,
        bgcolor: "#1e88e5",
        color: 'white',
        fontWeight: 600,
        textTransform: 'none',
        '&:hover': {
            bgcolor: '#1565c0',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(30, 136, 229, 0.2)'
        },
        transition: 'all 0.2s ease-in-out',
        '&:disabled': {
            bgcolor: '#90caf9',
            color: 'white'
        }
    }), []);

    useEffect(() => {
        dispatch(getAllPosts());
        dispatch(findPostsByLikeContainUser(user?.id));
    }, [dispatch, user?.id]);

    const formik = useFormik({
        initialValues: {
            content: "",
            image: null
        },
        validationSchema: POST_VALIDATION_SCHEMA,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            setIsSubmitting(true);
            try {
                await dispatch(createPost({
                    content: values.content,
                    file: values.image
                }));
                resetForm();
                setSelectedImage(null);
            } catch (error) {
                console.error('Error creating post:', error);
            } finally {
                setIsSubmitting(false);
                setSubmitting(false);
            }
        }
    });

    const handleSelectImage = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            formik.setFieldValue("image", imageFile);
            setSelectedImage(URL.createObjectURL(imageFile));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        formik.setFieldValue("image", null);
    };

    const handleAddEmoji = (emoji) => {
        formik.setFieldValue("content", formik.values.content + " " + emoji);
        setShowEmojiPicker(false);
    };

    const handleLocation = async () => {
        try {
            const position = await getCurrentPosition();
            const { latitude, longitude } = position.coords;
            formik.setFieldValue(
                "content",
                `${formik.values.content} 📍 Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            );
        } catch (error) {
            console.error("Error getting location:", error);
        }
    };

    const PostsSkeleton = () => (
        <Box sx={{ width: '100%', mt: 4 }}>
            {[1, 2, 3].map((i) => (
                <PostSkeleton key={i} />
            ))}
        </Box>
    );

    if (loading) {
        return <PostsSkeleton />;
    }

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <StorySlider />
            </Box>

            <Typography
                variant="h5"
                sx={{
                    mb: 4,
                    fontWeight: 600,
                    color: '#1e88e5',
                    borderBottom: '2px solid #e3f2fd',
                    pb: 2
                }}
            >
                Chia sẻ điều gì đó
            </Typography>

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                }}
            >
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                        alt={user?.fullName || 'User'}
                        src={user?.avatar || DEFAULT_AVATAR}
                        sx={{
                            width: 48,
                            height: 48,
                            border: '2px solid #e3f2fd'
                        }}
                    />
                    <Box sx={{ flex: 1 }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Box
                                component="input"
                                type="text"
                                name="content"
                                placeholder="Bạn đang nghĩ gì?"
                                {...formik.getFieldProps("content")}
                                sx={{
                                    width: '100%',
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    '&:focus': {
                                        borderColor: '#1e88e5',
                                        boxShadow: '0 0 0 2px rgba(30,136,229,0.2)'
                                    }
                                }}
                            />
                            {formik.touched.content && formik.errors.content && (
                                <Typography
                                    color="error"
                                    variant="caption"
                                    sx={{ display: 'block', mt: 1 }}
                                >
                                    {formik.errors.content}
                                </Typography>
                            )}

                            {selectedImage && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        position: 'relative',
                                        display: 'inline-block'
                                    }}
                                >
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        style={{
                                            maxWidth: '300px',
                                            maxHeight: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0'
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
                            )}

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 2
                            }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Tooltip title="Thêm ảnh" arrow>
                                        <label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleSelectImage}
                                                style={{ display: 'none' }}
                                            />
                                            <IconButton
                                                component="span"
                                                sx={{
                                                    color: '#1e88e5',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(30,136,229,0.1)'
                                                    }
                                                }}
                                            >
                                                <ImageIcon />
                                            </IconButton>
                                        </label>
                                    </Tooltip>

                                    <Tooltip title="Thêm vị trí" arrow>
                                        <IconButton
                                            onClick={handleLocation}
                                            sx={{
                                                color: '#1e88e5',
                                                '&:hover': {
                                                    bgcolor: 'rgba(30,136,229,0.1)'
                                                }
                                            }}
                                        >
                                            <FmdGoodIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Box sx={{ position: 'relative' }}>
                                        <Tooltip title="Thêm emoji" arrow>
                                            <IconButton
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                sx={{
                                                    color: '#1e88e5',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(30,136,229,0.1)'
                                                    }
                                                }}
                                            >
                                                <TagFacesIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Fade in={showEmojiPicker}>
                                            <Paper
                                                sx={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    mt: 1,
                                                    p: 1,
                                                    display: showEmojiPicker ? 'grid' : 'none',
                                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                                    gap: 0.5,
                                                    zIndex: 1000,
                                                    boxShadow: 3
                                                }}
                                            >
                                                {EMOJIS.map((emoji) => (
                                                    <Box
                                                        key={emoji}
                                                        onClick={() => handleAddEmoji(emoji)}
                                                        sx={{
                                                            fontSize: '1.5rem',
                                                            p: 0.5,
                                                            cursor: 'pointer',
                                                            borderRadius: 1,
                                                            textAlign: 'center',
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(0,0,0,0.04)',
                                                                transform: 'scale(1.2)'
                                                            }
                                                        }}
                                                    >
                                                        {emoji}
                                                    </Box>
                                                ))}
                                            </Paper>
                                        </Fade>
                                    </Box>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting || !formik.values.content.trim()}
                                    sx={buttonStyles}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Đăng bài'
                                    )}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ mt: 4 }}>
                {posts?.length === 0 ? (
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            color: 'text.secondary',
                            py: 4
                        }}
                    >
                        Chưa có bài viết nào.
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported"));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

HomeSection.propTypes = {
    // Add your prop types here
};

export default HomeSection;

import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    Box,
    Menu,
    MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import { likePost, deletePost } from '../../store/actions/post';
import { formatDate } from '../../utils/date';
import { ROUTES } from '../../config/routes';

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
}));

const PostImage = styled('img')({
    width: '100%',
    maxHeight: '500px',
    objectFit: 'cover',
    borderRadius: '8px',
});

const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLike = async () => {
        await dispatch(likePost(post.id));
    };

    const handleDelete = async () => {
        await dispatch(deletePost(post.id));
        handleMenuClose();
    };

    const handleProfileClick = () => {
        navigate(`${ROUTES.PROFILE}/${post.user.id}`);
    };

    const isLiked = post.likes.some(like => like.id === user?.id);
    const isOwner = post.user.id === user?.id;

    return (
        <StyledCard>
            <CardHeader
                avatar={
                    <Avatar
                        src={post.user.image}
                        alt={post.user.fullName}
                        onClick={handleProfileClick}
                        sx={{ cursor: 'pointer' }}
                    />
                }
                action={
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={
                    <Typography
                        variant="subtitle1"
                        sx={{ cursor: 'pointer' }}
                        onClick={handleProfileClick}
                    >
                        {post.user.fullName}
                    </Typography>
                }
                subheader={formatDate(post.createdAt)}
            />
            <CardContent>
                <Typography variant="body1" paragraph>
                    {post.content}
                </Typography>
                {post.image && <PostImage src={post.image} alt="Post" />}
            </CardContent>
            <CardActions disableSpacing>
                <IconButton onClick={handleLike}>
                    {isLiked ? (
                        <FavoriteIcon color="error" />
                    ) : (
                        <FavoriteBorderIcon />
                    )}
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                    {post.likes.length}
                </Typography>
                <IconButton>
                    <ChatBubbleOutlineIcon />
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                    {post.comments.length}
                </Typography>
                <IconButton>
                    <ShareIcon />
                </IconButton>
            </CardActions>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {isOwner && (
                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        Delete
                    </MenuItem>
                )}
                <MenuItem onClick={handleMenuClose}>Report</MenuItem>
            </Menu>
        </StyledCard>
    );
};

export default PostCard; 
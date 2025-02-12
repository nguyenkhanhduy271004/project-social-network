import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RepeatIcon from '@mui/icons-material/Repeat';
import { Avatar, Button, Menu, MenuItem, TextField, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MoreHoriz, Send } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { deletePost, likePost, commentOnPost, createPostReply } from '../../Store/Post/Action';

function PostCard({ post }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const likedPosts = useSelector(state => state.post.likedPosts);
    const isLiked = likedPosts.some(likedPost => likedPost.id === post.id);
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeletePost = () => {
        dispatch(deletePost(post?.id));
        handleClose();
    };

    const handleLikePost = () => {
        dispatch(likePost(post?.id));
    };

    const handleCommentSubmit = () => {
        if (comment.trim()) {
            dispatch(createPostReply());
            setComment('');
        }
    };

    useEffect(() => {

    }, [dispatch])

    return (
        <div className="border p-4 rounded-lg shadow-md bg-white mb-4">
            <div className="flex space-x-4">
                <Avatar
                    onClick={() => navigate(`/profile/${post?.user?._id}`)}
                    className="cursor-pointer"
                    alt={post?.user?.fullName}
                    src={post?.user?.avatar || 'https://via.placeholder.com/150'}
                />
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <div className="flex cursor-pointer items-center space-x-2">
                            <span className="font-semibold">{post?.user?.fullName}</span>
                            <span className="text-gray-600">@{post?.user?.email} · 2m</span>
                        </div>
                        <div>
                            <Button onClick={handleClick}>
                                <MoreHoriz />
                            </Button>
                            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                <MenuItem onClick={handleDeletePost}>Xóa bài</MenuItem>
                                <MenuItem onClick={handleClose}>Chỉnh sửa</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <p className="mt-2">{post?.content}</p>
                    {post?.image && (
                        <img className="w-full rounded-md mt-2" src={post?.image} alt="post-image" />
                    )}
                    <div className="mt-4 flex items-center justify-between text-gray-600">
                        <div className="flex space-x-5">
                            <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-500">
                                <ChatBubbleOutlineIcon fontSize="small" />
                                <p className="text-sm" onClick={() => setShowComments(!showComments)}>
                                    {post?.comments?.length || 0} Bình luận
                                </p>
                            </div>
                            <div onClick={handleLikePost} className="cursor-pointer flex items-center space-x-2 hover:text-red-500">
                                {isLiked ? <FavoriteIcon fontSize="small" color="error" /> : <FavoriteBorderIcon fontSize="small" />}
                                <p className="text-sm">{post?.totalLikes}</p>
                            </div>
                            <div className="flex items-center space-x-2 cursor-pointer hover:text-green-500">
                                <RepeatIcon fontSize="small" />
                                <p className="text-sm">Chia sẻ</p>
                            </div>
                        </div>
                    </div>
                    {showComments && (
                        <div className="mt-4">
                            <div className="flex items-center space-x-2">
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    placeholder="Viết bình luận..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <IconButton onClick={handleCommentSubmit} color="primary">
                                    <Send />
                                </IconButton>
                            </div>
                            <div className="mt-2 space-y-2">
                                {post?.comments?.map((cmt, index) => (
                                    <div key={index} className="flex items-start space-x-3 border p-2 rounded-md">
                                        <Avatar src={cmt?.user?.avatar} />
                                        <div>
                                            <p className="text-sm font-semibold">{cmt?.user?.fullName}</p>
                                            <p className="text-sm text-gray-700">{cmt?.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostCard;
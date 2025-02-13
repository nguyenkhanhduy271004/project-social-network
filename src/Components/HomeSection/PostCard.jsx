import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RepeatIcon from '@mui/icons-material/Repeat';
import { Avatar, Button, Menu, MenuItem, TextField, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MoreHoriz, Send } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { deletePost, likePost, createPostReply, createRePost } from '../../Store/Post/Action';

function PostCard({ post }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const likedPosts = useSelector(state => state.post.likedPosts);
    const currentUser = useSelector(state => state.auth.user);

    const [isLiked, setIsLiked] = useState(likedPosts?.some(likedPost => likedPost.id === post.id));
    const [totalLikes, setTotalLikes] = useState(post?.totalLikes || 0);
    const [totalReplies, setTotalReplies] = useState(post?.totalReplies || 0);
    const [totalComments, setTotalComments] = useState(post?.replyPosts?.length ?? 0);

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
        setIsLiked(!isLiked);
        setTotalLikes(prevLikes => isLiked ? prevLikes - 1 : prevLikes + 1);
    };

    const handleCommentSubmit = () => {
        if (comment.trim()) {
            const formData = new FormData();
            formData.set("content", comment);
            formData.set("postId", post?.id);
            dispatch(createPostReply(formData));
            setComment('');
            setTotalReplies(prevTotalReplies => prevTotalReplies + 1);
        }
    };

    const handleSharePost = () => {
        dispatch(createRePost(post?.id));
        setTotalReplies(prevTotalReplies => prevTotalReplies + 1);
    };

    useEffect(() => { }, [dispatch, isLiked, totalReplies, showComments]);

    return (
        <div className="border p-4 rounded-lg shadow-md bg-white mb-4">
            <div className="flex space-x-4">
                <Avatar
                    onClick={() => navigate(`/profile/${post?.user?._id}`)}
                    className="cursor-pointer"
                    alt={post?.user?.fullName}
                    src={post?.user?.image || 'https://via.placeholder.com/150'}
                />
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <div className="flex cursor-pointer items-center space-x-2">
                            <span className="font-semibold">{post?.user?.fullName}</span>
                            <span className="text-gray-600">
                                @{post.user?.fullName ? post.user.fullName.split(" ").join("_").toLowerCase() : "unknown_user"} · 2m
                            </span>
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
                            <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-500" onClick={() => setShowComments(!showComments)}>
                                <ChatBubbleOutlineIcon fontSize="small" />
                                <p className="text-sm">
                                    {totalComments}
                                </p>
                            </div>
                            <div onClick={handleLikePost} className="cursor-pointer flex items-center space-x-2 hover:text-red-500">
                                {isLiked ? <FavoriteIcon fontSize="small" color="error" /> : <FavoriteBorderIcon fontSize="small" />}
                                <p className="text-sm">{totalLikes}</p>
                            </div>
                            <div className="flex items-center space-x-2 cursor-pointer hover:text-green-500" onClick={handleSharePost}>
                                <RepeatIcon fontSize="small" />
                                <p className="text-sm">{totalReplies}</p>
                            </div>
                        </div>
                    </div>

                    {showComments && (
                        <div className="mt-4 p-3 border rounded-md bg-gray-100">
                            <div className="flex items-center space-x-2">
                                <Avatar
                                    src={currentUser?.avatar || 'https://via.placeholder.com/150'}
                                    alt="User Avatar"
                                />
                                <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    placeholder="Viết bình luận..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
                                />
                                <IconButton onClick={handleCommentSubmit} color="primary">
                                    <Send />
                                </IconButton>
                            </div>
                            <div className="mt-3 max-h-60 overflow-y-auto">
                                {post?.comments?.length > 0 ? (
                                    post?.comments?.map((cmt, index) => (
                                        <div key={index} className="flex items-start space-x-3 border-b p-2">
                                            <Avatar src={cmt?.user?.avatar} />
                                            <div className="bg-white p-2 rounded-md shadow-sm w-full">
                                                <p className="text-sm font-semibold">{cmt?.user?.fullName}</p>
                                                <p className="text-sm text-gray-700">{cmt?.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center mt-2">Chưa có bình luận nào.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostCard;

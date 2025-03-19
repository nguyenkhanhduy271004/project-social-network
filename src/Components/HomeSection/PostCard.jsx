import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Menu, MenuItem, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MoreHoriz, Send } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useNavigate } from 'react-router-dom';
import { deletePost, likePost, createComment, createRePost, editPost, getComments } from '../../Store/Post/Action';

function PostCard({ post }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector(store => store.auth.user);

    const likedPosts = useSelector(store => store.post.likedPosts);

    const [isLiked, setIsLiked] = useState(likedPosts.some(likedPost => likedPost.id === post.id));

    const [totalLikes, setTotalLikes] = useState(post?.totalLikes || 0);
    const [totalReplies, setTotalReplies] = useState(post?.totalReplies || 0);
    const [totalComments, setTotalComments] = useState(post?.totalComments ?? 0);

    const reduxComments = useSelector(state => state.post.commentPost?.[post?.id] ?? []);
    const [comments, setComments] = useState(reduxComments);
    const [showComments, setShowComments] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editedContent, setEditedContent] = useState(post?.content || "");
    const [editedImage, setEditedImage] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (post?.id) {
            dispatch(getComments(post.id));
        }
    }, [dispatch, post?.id]);

    useEffect(() => {
        setComments(reduxComments);
    }, [reduxComments]);

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

        setIsLiked(prev => !prev);

        setTotalLikes(prevLikes => isLiked ? prevLikes - 1 : prevLikes + 1);
    };

    const handleCommentSubmit = () => {
        if (comment.trim()) {
            const newComment = {
                user: {
                    fullName: `${user.fullName}`,
                    image: `${user.image ? user.image : "https://via.placeholder.com/150"}`
                },
                content: comment
            };

            const formData = new FormData();
            formData.set("content", comment);
            formData.set("postId", post?.id);

            dispatch(createComment(formData));

            setComments(prevComments => [...prevComments, newComment]);
            setTotalComments(prevTotal => prevTotal + 1);
            setComment('');
        }
    };

    const handleSharePost = () => {
        dispatch(createRePost(post?.id));
        setTotalReplies(prevTotalReplies => prevTotalReplies == 1 ? 0 : 1);
    };

    const handleEditPost = () => {
        setOpenEditModal(true);
        handleClose();
    };

    const handleSaveEdit = () => {
        const updatedPost = {
            content: editedContent,
            postId: post?.id
        };
        dispatch(editPost(post?.id, updatedPost));
        setOpenEditModal(false);
    };

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
                                <MenuItem onClick={handleEditPost}>Chỉnh sửa</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <p className="mt-2">{editedContent || post?.content}</p>
                    {post?.image && <img className="w-full rounded-md mt-2" src={post?.image} alt="post" />}
                    <div className="mt-4 flex items-center justify-between text-gray-600">
                        <div className="flex space-x-5">
                            <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
                                onClick={() => setShowComments(!showComments)}>
                                <ChatBubbleOutlineIcon fontSize="small" />
                                <p className="text-sm">{totalComments}</p>
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
                        <div className="mt-3 border-t pt-3">
                            {comments.map((comment, index) => (
                                <div key={index} className="flex space-x-3 items-start mb-2">
                                    <Avatar src={comment.user?.image || 'https://via.placeholder.com/150'} />
                                    <div className="bg-gray-100 p-2 rounded-md w-full">
                                        <p className="font-semibold">{comment.user?.fullName}</p>
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-center space-x-2 mt-3">
                                <TextField fullWidth value={comment} onChange={(e) => setComment(e.target.value)} label="Viết bình luận..." variant="outlined" size="small" />
                                <IconButton onClick={handleCommentSubmit} color="primary"><Send /></IconButton>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostCard;

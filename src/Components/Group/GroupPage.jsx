import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Paper, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPostInGroup, joinGroup, leaveGroup } from "../../Store/Group/Action";
import { createPost } from "../../Store/Post/Action";
import ImageIcon from '@mui/icons-material/Image';
import { api } from "../../config/api";

const defaultThumbnail = "https://visiblenetworklabs.com/wp-content/uploads/2023/01/Foundations-SNA.png";
const defaultAvatar = "https://via.placeholder.com/100";

const GroupPage = ({ group }) => {
    const [openMembers, setOpenMembers] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [openPostDialog, setOpenPostDialog] = useState(false);
    const [postContent, setPostContent] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const dispatch = useDispatch();

    const auth = useSelector(state => state.auth);

    const [isMember, setIsMember] = useState(group.members.some(member => member.id === auth.user.id));

    const handleRemoveMember = (memberId) => {
        setMemberToRemove(memberId);
        setOpenConfirmDialog(true);
    };

    const confirmRemoveMember = () => {
        if (memberToRemove) {
            api.delete(`/api/groups/${group.id}/user/${memberToRemove}`)
                .then(response => {
                    if (response.status === 200) {
                        const updatedMembers = group.members.filter(member => member.id !== memberToRemove);
                        group.members = updatedMembers;
                        setMemberToRemove(null);
                        setOpenConfirmDialog(false);
                    } else {
                        console.error("Failed to remove member:", response.statusText);
                    }
                })
                .catch(error => {
                    console.error("Error removing member:", error);
                });
        } else {
            setOpenConfirmDialog(false);
        }
    };

    const cancelRemoveMember = () => {
        setMemberToRemove(null);
        setOpenConfirmDialog(false);
    };

    const handleJoinGroup = (groupId) => {
        dispatch(joinGroup(groupId));
        setIsMember(true);
    }

    const handleLeaveGroup = (groupId) => {
        dispatch(leaveGroup(groupId));
        setIsMember(false);
    }

    const handleOpenPostDialog = () => {
        setOpenPostDialog(true);
    };

    const handleClosePostDialog = () => {
        setOpenPostDialog(false);
        setPostContent("");
        setSelectedImage(null);
    };

    const handleSelectImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file); // Store the actual file object, not the URL
        }
    };

    const handlePostSubmit = () => {
        if (postContent.trim() || selectedImage) {
            const postData = {
                content: postContent,
                file: selectedImage,
            };

            dispatch(createPostInGroup(group.id, postData));
            handleClosePostDialog();
        }
    };

    useEffect(() => {
        return () => {
            if (selectedImage) URL.revokeObjectURL(selectedImage);
        };
    }, [selectedImage]);

    useEffect(() => {
    }, [isMember, dispatch]);

    if (!group) return <Typography variant="h6">Không tìm thấy nhóm</Typography>;

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Paper
                sx={{
                    width: "80%",
                    maxWidth: 800,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                    backgroundColor: "#ffffff",
                }}
            >
                <CardMedia
                    component="img"
                    height="200"
                    image={group.thumbnail || defaultThumbnail}
                    alt="Group Thumbnail"
                    sx={{ borderRadius: 2 }}
                />

                <Box display="flex" justifyContent="center" mt={-4}>
                    <Avatar
                        src={group.avatar || defaultAvatar}
                        sx={{ width: 100, height: 100, border: "3px solid white" }}
                    />
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 700, color: "#1976d2", textAlign: "center", mt: 2 }}>
                    {group.name}
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={group.admin?.avatar || defaultAvatar} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Admin: {group.admin?.fullName || "Không xác định"}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                        <Button variant="contained" color="primary" onClick={() => setOpenMembers(true)}>
                            Thành viên ({group.members.length})
                        </Button>

                        {!isMember
                            ? (
                                <Button variant="contained" color="primary" onClick={() => handleJoinGroup(group.id)}>
                                    Tham gia nhóm
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" onClick={() => handleLeaveGroup(group.id)}>
                                    Rời nhóm
                                </Button>
                            )}
                    </Box>
                </Box>

                <Typography variant="caption" sx={{ color: "#616161", mt: 1 }}>
                    Ngày tạo: {new Date(group.createdDate).toLocaleDateString()}
                </Typography>

                <Dialog open={openMembers} onClose={() => setOpenMembers(false)}>
                    <DialogTitle>Danh sách thành viên</DialogTitle>
                    <DialogContent>
                        <List>
                            {group.members.length > 0 ? (
                                group.members.map((member) => (
                                    <ListItem key={member.id}>
                                        <ListItemAvatar>
                                            <Avatar src={member.avatar || defaultAvatar} />
                                        </ListItemAvatar>
                                        <ListItemText primary={member.fullName} />
                                        {auth.user?.id === group.admin?.id && group.admin?.id !== member.id && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                sx={{ ml: '4px' }}
                                                onClick={() => handleRemoveMember(member.id)}
                                            >
                                                Xóa
                                            </Button>
                                        )}
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2" sx={{ color: "#616161", textAlign: "center" }}>
                                    Nhóm chưa có thành viên.
                                </Typography>
                            )}
                        </List>
                    </DialogContent>
                </Dialog>

                <Dialog open={openPostDialog} onClose={handleClosePostDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Đăng bài mới</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2} mt={1}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Bạn đang nghĩ gì?"
                                multiline
                                rows={4}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                            <Box display="flex" alignItems="center" gap={2}>
                                <label>
                                    <IconButton component="span">
                                        <ImageIcon sx={{ color: "#1976d2" }} />
                                    </IconButton>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleSelectImage}
                                    />
                                </label>
                                {selectedImage && (
                                    <Box>
                                        <img
                                            src={URL.createObjectURL(selectedImage)}
                                            alt="Preview"
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                                border: "1px solid #e0e0e0",
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePostDialog} color="secondary">
                            Hủy
                        </Button>
                        <Button
                            onClick={handlePostSubmit}
                            color="primary"
                            variant="contained"
                            disabled={!postContent.trim() && !selectedImage}
                        >
                            Đăng
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openConfirmDialog} onClose={cancelRemoveMember} aria-labelledby="confirm-remove-member-dialog">
                    <DialogTitle id="confirm-remove-member-dialog">Xác nhận xóa thành viên</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelRemoveMember} color="secondary">Hủy</Button>
                        <Button onClick={confirmRemoveMember} color="error">Xóa</Button>
                    </DialogActions>
                </Dialog>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Bài viết ({group.posts.length}):
                    <Button variant="contained" color="primary" onClick={handleOpenPostDialog} sx={{ ml: '540px' }}>
                        Đăng bài
                    </Button>
                </Typography>
                {group.posts.length > 0 ? (
                    group.posts.map((post) => (
                        <Card key={post.id} sx={{ mb: 2, borderRadius: 2, boxShadow: "0px 1px 5px rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar src={post.user?.avatar || defaultAvatar} />
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {post.user?.fullName || "Người dùng ẩn danh"}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
                                    {post.content}
                                </Typography>
                                {post.image && (
                                    <CardMedia component="img" height="200" image={post.image} alt="Post Image" sx={{ borderRadius: 2, mt: 1 }} />
                                )}
                                <Typography variant="caption" sx={{ color: "#616161", mt: 1 }}>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ color: "#616161", textAlign: "center" }}>
                        Chưa có bài viết nào.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default GroupPage;

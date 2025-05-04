import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup, fetchUserGroups, getGroups, getPostsFromGroup, joinGroup, leaveGroup } from "../../Store/Group/Action";
import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    Tooltip,
    Skeleton,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";

const LoadingSkeleton = () => (
    <Box sx={{ width: '100%' }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2, borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
    </Box>
);

const Groups = () => {
    const dispatch = useDispatch();
    const groupState = useSelector((state) => state?.group || {});
    const { loading = false } = groupState;
    const userGroups = groupState?.userGroups || [];
    const allGroups = groupState?.groups || [];
    const posts = groupState?.posts || [];
    const user = useSelector(state => state.auth.user);

    const [groupName, setGroupName] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [localLoading, setLocalLoading] = useState(true);
    const [joinRequestStatus, setJoinRequestStatus] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [joinRequestDialog, setJoinRequestDialog] = useState(false);
    const [joiningGroup, setJoiningGroup] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLocalLoading(true);
            try {
                await Promise.all([
                    dispatch(getGroups()),
                    dispatch(fetchUserGroups()),
                    dispatch(getPostsFromGroup())
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLocalLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            if (selectedGroup?.id && user?.id === selectedGroup?.admin?.id) {
                try {
                    const response = await api.get(`/api/groups/${selectedGroup.id}/pending-requests`);
                    setPendingRequests(response.data.data);
                } catch (error) {
                    console.error('Error fetching pending requests:', error);
                    setSnackbar({
                        open: true,
                        message: 'Không thể tải danh sách yêu cầu tham gia',
                        severity: 'error'
                    });
                }
            }
        };

        if (joinRequestDialog) {
            fetchPendingRequests();
        }
    }, [selectedGroup?.id, user?.id, selectedGroup?.admin?.id, joinRequestDialog]);

    const handleCreateGroup = async (name) => {
        if (!name?.trim()) return;
        setIsCreating(true);
        try {
            const groupData = {
                name: name.trim(),
                isPublic: isPublic
            };
            await dispatch(createGroup(groupData));
            await dispatch(fetchUserGroups());
            setGroupName("");
            setSnackbar({
                open: true,
                message: 'Nhóm đã được tạo thành công',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error creating group:', error);
            setSnackbar({
                open: true,
                message: 'Không thể tạo nhóm. Vui lòng thử lại',
                severity: 'error'
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinRequest = async (groupId) => {
        try {
            const response = await api.post(`/api/posts/${groupId}/request-join`);
            setJoinRequestStatus(prev => ({
                ...prev,
                [groupId]: 'pending'
            }));
            setSnackbar({
                open: true,
                message: 'Yêu cầu tham gia đã được gửi',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error sending join request:', error);
            setSnackbar({
                open: true,
                message: error.response?.data || 'Không thể gửi yêu cầu tham gia',
                severity: 'error'
            });
        }
    };

    const handleApproveRequest = async (groupId, userId, approve) => {
        try {
            if (approve) {
                await api.post(`/api/groups/${groupId}/accept-request/${userId}`);
            } else {
                await api.post(`/api/groups/${groupId}/reject-request/${userId}`);
            }

            // Refresh pending requests list
            const response = await api.get(`/api/groups/${groupId}/pending-requests`);
            setPendingRequests(response.data.data);

            setSnackbar({
                open: true,
                message: `Yêu cầu đã được ${approve ? 'chấp nhận' : 'từ chối'}`,
                severity: 'success'
            });

            if (approve) {
                dispatch(fetchUserGroups());
            }
        } catch (error) {
            console.error('Error handling join request:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Không thể xử lý yêu cầu. Vui lòng thử lại',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleLeaveGroup = async (groupId) => {
        if (!groupId) return;
        try {
            await dispatch(leaveGroup(groupId));
            await dispatch(fetchUserGroups());
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    const handleJoinGroup = async (groupId) => {
        if (!groupId) return;
        setJoiningGroup(groupId);
        try {
            const group = allGroups.find(g => g.id === groupId);
            if (group?.isPublic) {
                await dispatch(joinGroup(groupId));
                await dispatch(fetchUserGroups());
                setSnackbar({
                    open: true,
                    message: 'Đã tham gia nhóm thành công',
                    severity: 'success'
                });
            } else {
                await handleJoinRequest(groupId);
            }
        } catch (error) {
            console.error('Error joining group:', error);
            setSnackbar({
                open: true,
                message: 'Không thể tham gia nhóm. Vui lòng thử lại',
                severity: 'error'
            });
        } finally {
            setJoiningGroup(null);
        }
    };

    if (loading || localLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <LoadingSkeleton />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <LoadingSkeleton />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#1a237e" }}>
                                Tạo Nhóm Mới
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Nhập tên nhóm..."
                                variant="outlined"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                sx={{ mb: 2 }}
                                disabled={isCreating}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label={isPublic ? "Nhóm công khai" : "Nhóm riêng tư"}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleCreateGroup(groupName)}
                                startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                                disabled={!groupName?.trim() || isCreating}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    bgcolor: '#1a237e',
                                    '&:hover': {
                                        bgcolor: '#0d1642'
                                    }
                                }}
                            >
                                {isCreating ? 'Đang tạo...' : 'Tạo Nhóm'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#1a237e" }}>
                                Nhóm Đã Tham Gia ({userGroups?.length || 0})
                            </Typography>
                            {!Array.isArray(userGroups) || userGroups.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                    <GroupIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                                    <Typography>Chưa tham gia nhóm nào</Typography>
                                </Box>
                            ) : (
                                <List sx={{ mx: -2 }}>
                                    {userGroups.map((group) => (
                                        group && group.id && (
                                            <React.Fragment key={group.id}>
                                                <ListItem sx={{
                                                    px: 2,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0,0,0,0.04)'
                                                    }
                                                }}>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: "#1a237e" }}>
                                                            <GroupIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={group.name}
                                                        secondary={group.isPublic ? 'Công khai' : 'Riêng tư'}
                                                        onClick={() => navigate(`/groups/${group.id}`)}
                                                        sx={{ cursor: 'pointer' }}
                                                    />
                                                    {group.admin?.id === user?.id ? (
                                                        <Tooltip title="Quản lý yêu cầu">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={() => {
                                                                    setSelectedGroup(group);
                                                                    setJoinRequestDialog(true);
                                                                }}
                                                            >
                                                                Quản lý
                                                            </Button>
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Rời nhóm">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="error"
                                                                onClick={() => handleLeaveGroup(group.id)}
                                                            >
                                                                Rời nhóm
                                                            </Button>
                                                        </Tooltip>
                                                    )}
                                                </ListItem>
                                                <Divider component="li" />
                                            </React.Fragment>
                                        )
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#1a237e" }}>
                                Bài Viết Từ Nhóm ({posts?.length || 0})
                            </Typography>
                            {!Array.isArray(posts) || posts.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                                    <Typography>Chưa có bài viết nào</Typography>
                                </Box>
                            ) : (
                                <Box display="flex" flexDirection="column" gap={2}>
                                    {posts.map((post) => {
                                        if (!post) return null;
                                        const isJoined = Array.isArray(userGroups) &&
                                            post.groupId &&
                                            userGroups.some(group => group && group.id === post.groupId);

                                        // Find the group this post belongs to
                                        const postGroup = allGroups.find(g => g.id === post.groupId);

                                        // Show post if:
                                        // 1. Group is public, OR
                                        // 2. User is a member of the group
                                        const canViewPost = postGroup?.isPublic || isJoined;
                                        if (!canViewPost) {
                                            return null;
                                        }

                                        return (
                                            <Card
                                                key={post.id}
                                                sx={{
                                                    borderRadius: 2,
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                                                    },
                                                    transition: 'box-shadow 0.3s ease'
                                                }}
                                            >
                                                <CardContent>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                                        <Box>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    color: "#1a237e",
                                                                    fontWeight: 500,
                                                                    cursor: 'pointer',
                                                                    '&:hover': {
                                                                        textDecoration: 'underline'
                                                                    }
                                                                }}
                                                                onClick={() => post.groupId && navigate(`/groups/${post.groupId}`)}
                                                            >
                                                                {post.nameGroup || "Không có nhóm"}
                                                                {postGroup && !postGroup.isPublic && (
                                                                    <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#666' }}>
                                                                        (Nhóm riêng tư)
                                                                    </span>
                                                                )}
                                                            </Typography>
                                                            {isJoined && (
                                                                <Typography variant="caption" sx={{ color: 'success.main', display: 'block' }}>
                                                                    Bạn đã tham gia nhóm này
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                        {!isJoined && post.groupId && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={() => handleJoinGroup(post.groupId)}
                                                                disabled={joiningGroup === post.groupId || joinRequestStatus[post.groupId] === 'pending'}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    textTransform: 'none',
                                                                    bgcolor: '#1a237e',
                                                                    '&:hover': {
                                                                        bgcolor: '#0d1642'
                                                                    }
                                                                }}
                                                            >
                                                                {joiningGroup === post.groupId ? (
                                                                    <CircularProgress size={20} color="inherit" />
                                                                ) : joinRequestStatus[post.groupId] === 'pending' ? (
                                                                    'Đã gửi yêu cầu'
                                                                ) : (
                                                                    'Tham gia nhóm'
                                                                )}
                                                            </Button>
                                                        )}
                                                    </Box>

                                                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                                                        <Avatar sx={{ width: 40, height: 40, bgcolor: '#1a237e' }}>
                                                            {post.user?.fullName?.charAt(0) || '?'}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                                {post.user?.fullName || 'Unknown User'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                }) : 'Unknown date'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                                                        {post.content || ''}
                                                    </Typography>

                                                    {post.image && (
                                                        <Box mb={2}>
                                                            <img
                                                                src={post.image}
                                                                alt="Post Image"
                                                                style={{
                                                                    width: "100%",
                                                                    borderRadius: 8,
                                                                    maxHeight: 500,
                                                                    objectFit: 'cover'
                                                                }}
                                                                loading="lazy"
                                                            />
                                                        </Box>
                                                    )}

                                                    {post.video && (
                                                        <Box mb={2}>
                                                            <video
                                                                width="100%"
                                                                controls
                                                                style={{ borderRadius: 8 }}
                                                                preload="metadata"
                                                            >
                                                                <source src={post.video} type="video/mp4" />
                                                                Trình duyệt của bạn không hỗ trợ video.
                                                            </video>
                                                        </Box>
                                                    )}

                                                    <Box
                                                        display="flex"
                                                        gap={3}
                                                        sx={{
                                                            color: "text.secondary",
                                                            '& > div': {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 0.5,
                                                                cursor: 'pointer',
                                                                '&:hover': {
                                                                    color: '#1a237e'
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Box>
                                                            <span>❤️</span>
                                                            <Typography>{post.totalLikes || 0} thích</Typography>
                                                        </Box>
                                                        <Box>
                                                            <span>💬</span>
                                                            <Typography>{post.totalComments || 0} bình luận</Typography>
                                                        </Box>
                                                        <Box>
                                                            <span>🔁</span>
                                                            <Typography>{post.totalReplies || 0} chia sẻ</Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Dialog
                    open={joinRequestDialog}
                    onClose={() => setJoinRequestDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Yêu cầu tham gia nhóm {selectedGroup?.name}
                    </DialogTitle>
                    <DialogContent>
                        {pendingRequests.length === 0 ? (
                            <Typography color="text.secondary" sx={{ py: 2 }}>
                                Không có yêu cầu tham gia nào
                            </Typography>
                        ) : (
                            <List>
                                {pendingRequests.map((request) => (
                                    <ListItem
                                        key={request.id}
                                        secondaryAction={
                                            <Box>
                                                <Button
                                                    color="primary"
                                                    onClick={() => handleApproveRequest(selectedGroup.id, request.id, true)}
                                                >
                                                    Chấp nhận
                                                </Button>
                                                <Button
                                                    color="error"
                                                    onClick={() => handleApproveRequest(selectedGroup.id, request.id, false)}
                                                >
                                                    Từ chối
                                                </Button>
                                            </Box>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={request?.image} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={request?.fullName}
                                            secondary={new Date(request.createdAt).toLocaleDateString('vi-VN')}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setJoinRequestDialog(false)}>
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Grid>
        </Container>
    );
};

export default Groups;

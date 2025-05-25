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
    Alert,
    InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";
import PostCard from "../HomeSection/PostCard";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredGroups, setFilteredGroups] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLocalLoading(true);
            try {
                console.log('Fetching data...');
                await Promise.all([
                    dispatch(getGroups()),
                    dispatch(fetchUserGroups()),
                    dispatch(getPostsFromGroup())
                ]);
                console.log('Data fetched successfully');
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLocalLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredGroups(allGroups);
        } else {
            const filtered = allGroups.filter(group =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredGroups(filtered);
        }
    }, [searchQuery, allGroups]);

    useEffect(() => {
        setFilteredGroups(allGroups);
    }, [allGroups]);

    useEffect(() => {
        console.log('Current posts:', posts);
    }, [posts]);

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
            const response = await api.post(`/api/v1/groups/${groupId}/request-join`);
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
                await api.post(`/api/v1/groups/${groupId}/accept-request/${userId}`);
            } else {
                await api.post(`/api/v1/groups/${groupId}/reject-request/${userId}`);
            }

            // Refresh pending requests list
            const response = await api.get(`/api/v1/groups/${groupId}/pending-requests`);
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
                {/* Left Column - Group Management */}
                <Grid item xs={12} md={4}>
                    {/* Create Group Card */}
                    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
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

                    {/* Joined Groups Card */}
                    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                                                <ListItem
                                                    sx={{
                                                        px: 2,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0,0,0,0.04)',
                                                            cursor: 'pointer'
                                                        }
                                                    }}
                                                    onClick={() => navigate(`/groups/${group.id}`)}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: "#1a237e" }}>
                                                            <GroupIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={group.name}
                                                        secondary={group.isPublic ? 'Công khai' : 'Riêng tư'}
                                                    />
                                                    {group.admin?.id === user?.id ? (
                                                        <Tooltip title="Quản lý yêu cầu">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
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
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleLeaveGroup(group.id);
                                                                }}
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

                {/* Right Column - Group Discovery and Posts */}
                <Grid item xs={12} md={8}>
                    {/* Group Search Card */}
                    <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#1a237e" }}>
                                Khám Phá Nhóm
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm nhóm..."
                                variant="outlined"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 3 }}
                            />
                            {filteredGroups.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                                    <GroupIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                                    <Typography>
                                        {searchQuery.trim() ? 'Không tìm thấy nhóm nào' : 'Chưa có nhóm nào'}
                                    </Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={2}>
                                    {filteredGroups.map((group) => (
                                        <Grid item xs={12} key={group.id}>
                                            <Card
                                                sx={{
                                                    borderRadius: 2,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: 3,
                                                        cursor: 'pointer'
                                                    }
                                                }}
                                                onClick={() => navigate(`/groups/${group.id}`)}
                                            >
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: "#1a237e", width: 56, height: 56 }}>
                                                            <GroupIcon />
                                                        </Avatar>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                {group.name}
                                                            </Typography>
                                                            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {group.isPublic ? 'Công khai' : 'Riêng tư'}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {group.memberCount || 0} thành viên
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        {!userGroups.some(g => g.id === group.id) && (
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleJoinGroup(group.id);
                                                                }}
                                                                disabled={joiningGroup === group.id || joinRequestStatus[group.id] === 'pending'}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    textTransform: 'none',
                                                                    bgcolor: '#1a237e',
                                                                    '&:hover': {
                                                                        bgcolor: '#0d1642'
                                                                    }
                                                                }}
                                                            >
                                                                {joiningGroup === group.id ? (
                                                                    <CircularProgress size={20} color="inherit" />
                                                                ) : joinRequestStatus[group.id] === 'pending' ? (
                                                                    'Đã gửi yêu cầu'
                                                                ) : (
                                                                    'Tham gia nhóm'
                                                                )}
                                                            </Button>
                                                        )}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>

                    {/* Posts Card */}
                    <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                                        const isOwner = post.user?.id === user?.id;
                                        const isJoined = Array.isArray(userGroups) &&
                                            post.groupId &&
                                            userGroups.some(group => group && group.id === post.groupId);

                                        const postGroup = allGroups.find(group => group.id === post.groupId);

                                        return <PostCard
                                            key={post.id}
                                            post={{
                                                ...post,
                                                groupName: postGroup?.name || 'Không có nhóm',
                                                groupId: post.groupId
                                            }}
                                            isOwner={isOwner}
                                            isJoined={isJoined}
                                            onJoinGroup={() => handleJoinGroup(post.groupId)}
                                            joiningGroup={joiningGroup === post.groupId}
                                            joinRequestStatus={joinRequestStatus[post.groupId]}
                                        />;
                                    })}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Join Request Dialog */}
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

            {/* Snackbar for notifications */}
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
        </Container>
    );
};

export default Groups;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Tabs,
    Tab,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getDashboardMetrics } from '../../Store/Admin/Action';
import AdminUsers from './AdminUsers';
import AdminPosts from './AdminPosts';
import AdminStories from './AdminStories';
import AdminReels from './AdminReels';
import AdminGroups from './AdminGroups';
import AdminAIChat from './AdminAIChat';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChatIcon from '@mui/icons-material/Chat';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MovieIcon from '@mui/icons-material/Movie';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useNavigate } from 'react-router-dom';

const StyledTab = styled(Tab)(({ theme }) => ({
    fontWeight: 'bold',
    '&.Mui-selected': {
        color: '#1976d2',
    },
}));

const StyledMetricCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
    },
}));

const AdminDashboard = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dashboardMetrics, loading, error } = useSelector((state) => state.admin);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user || !user.admin) {
            navigate('/');
            return;
        }

        dispatch(getDashboardMetrics());
    }, [dispatch, navigate, user]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const renderTabContent = () => {
        switch (tabValue) {
            case 0:
                return (
                    <Box mt={4}>
                        <Grid container spacing={3}>
                            {/* Row 1 */}
                            <Grid item xs={12} md={3}>
                                <StyledMetricCard>
                                    <PeopleIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                        {dashboardMetrics.totalUsers}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tổng người dùng
                                    </Typography>
                                </StyledMetricCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StyledMetricCard>
                                    <PostAddIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                        {dashboardMetrics.totalPosts}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tổng bài viết
                                    </Typography>
                                </StyledMetricCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StyledMetricCard>
                                    <AutoStoriesIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                        {dashboardMetrics.totalStories}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tổng stories
                                    </Typography>
                                </StyledMetricCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StyledMetricCard>
                                    <MovieIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                        {dashboardMetrics.totalReels}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tổng reels
                                    </Typography>
                                </StyledMetricCard>
                            </Grid>

                            {/* Row 2 */}
                            <Grid item xs={12} md={3}>
                                <StyledMetricCard>
                                    <GroupsIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                        {dashboardMetrics.totalGroups}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tổng nhóm
                                    </Typography>
                                </StyledMetricCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StyledMetricCard>
                                    <ChatIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                        {dashboardMetrics.totalComments}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tổng bình luận
                                    </Typography>
                                </StyledMetricCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StyledMetricCard>
                                    <ThumbUpIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                        {dashboardMetrics.totalLikes}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tổng lượt thích
                                    </Typography>
                                </StyledMetricCard>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <StyledMetricCard>
                                    <BarChartIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                    <Typography variant="h5" fontWeight="bold" color="#1976d2">
                                        {Object.keys(dashboardMetrics.postsByMonth || {}).length}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Tháng đã hoạt động
                                    </Typography>
                                </StyledMetricCard>
                            </Grid>
                        </Grid>

                        <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Bài viết theo tháng
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ height: 300, display: 'flex', flexDirection: 'column' }}>
                                {Object.entries(dashboardMetrics.postsByMonth || {}).length > 0 ? (
                                    <Grid container spacing={2}>
                                        {Object.entries(dashboardMetrics.postsByMonth || {})
                                            .sort((a, b) => {
                                                const monthA = new Date(`${a[0]} 1, 2023`);
                                                const monthB = new Date(`${b[0]} 1, 2023`);
                                                return monthA - monthB;
                                            })
                                            .map(([month, count]) => (
                                                <Grid item xs={6} md={4} lg={3} key={month}>
                                                    <Card sx={{ p: 2, textAlign: 'center' }}>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {month}
                                                        </Typography>
                                                        <Typography variant="h6" color="primary">
                                                            {count} bài viết
                                                        </Typography>
                                                    </Card>
                                                </Grid>
                                            ))}
                                    </Grid>
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Typography variant="body1" color="text.secondary">
                                            Không có dữ liệu bài viết theo tháng
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Box>
                );
            case 1:
                return <AdminUsers />;
            case 2:
                return <AdminPosts />;
            case 3:
                return <AdminStories />;
            case 4:
                return <AdminReels />;
            case 5:
                return <AdminGroups />;
            case 6:
                return <AdminAIChat />;
            default:
                return null;
        }
    };

    if (loading && !dashboardMetrics.totalUsers) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ my: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#1976d2' }}>
                    Quản lý hệ thống
                </Typography>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <StyledTab label="Tổng quan" icon={<BarChartIcon />} iconPosition="start" />
                    <StyledTab label="Người dùng" icon={<PeopleIcon />} iconPosition="start" />
                    <StyledTab label="Bài viết" icon={<PostAddIcon />} iconPosition="start" />
                    <StyledTab label="Stories" icon={<AutoStoriesIcon />} iconPosition="start" />
                    <StyledTab label="Reels" icon={<MovieIcon />} iconPosition="start" />
                    <StyledTab label="Nhóm" icon={<GroupsIcon />} iconPosition="start" />
                    <StyledTab label="AI Chat" icon={<SmartToyIcon />} iconPosition="start" />
                </Tabs>

                {renderTabContent()}
            </Paper>
        </Container>
    );
};

export default AdminDashboard; 
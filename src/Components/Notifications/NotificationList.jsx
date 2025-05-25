import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Badge,
    IconButton,
    Menu,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
    Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDistanceToNow } from 'date-fns';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { API_BASE_URL } from '../../config/api';
import { addNotification, markAllNotificationsAsRead } from '../../Store/Notification/Action';

const formatNotificationTime = (timestamp) => {
    if (!timestamp) return 'Just now';

    try {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(Number(timestamp));
        if (isNaN(date.getTime())) {
            return 'Just now';
        }
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        console.error('Error formatting notification time:', error);
        return 'Just now';
    }
};

const NotificationList = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { auth } = useSelector(store => store);
    const { notifications, unreadCount } = useSelector(store => store.notification);
    const dispatch = useDispatch();
    const userId = auth.user?.id;
    const navigate = useNavigate();

    const stompRef = useRef(null);
    const subscriptionRef = useRef(null);

    const setupWebSocket = useCallback(() => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt || !userId) return;

        try {
            const sock = new SockJS(`${API_BASE_URL}/ws`);
            const stomp = Stomp.over(sock);
            stompRef.current = stomp;

            stomp.connect(
                { Authorization: `Bearer ${jwt}` },
                () => {
                    console.log('WebSocket connected for notifications');
                    subscribeToNotifications();
                },
                (error) => {
                    console.error('WebSocket connection error:', error);
                    setError('Không thể kết nối đến máy chủ thông báo');
                }
            );
        } catch (error) {
            console.error('WebSocket setup error:', error);
            setError('Lỗi kết nối WebSocket');
        }
    }, [userId]);

    const subscribeToNotifications = useCallback(() => {
        if (!stompRef.current?.connected || !userId) return;

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        const destination = `/user/${userId}/queue/notifications`;
        console.log('Subscribing to notifications at:', destination);

        subscriptionRef.current = stompRef.current.subscribe(
            destination,
            (message) => {
                try {
                    const notification = JSON.parse(message.body);
                    console.log('Received notification:', notification);
                    dispatch(addNotification(notification));
                } catch (error) {
                    console.error('Error processing notification:', error);
                }
            }
        );
    }, [userId, dispatch]);

    useEffect(() => {
        if (userId) {
            setupWebSocket();
        }

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
            if (stompRef.current?.connected) {
                stompRef.current.disconnect();
            }
        };
    }, [userId, setupWebSocket]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        dispatch(markAllNotificationsAsRead());
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewAll = () => {
        handleClose();
        navigate('/notifications');
    };

    return (
        <>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 400,
                        width: 360,
                    },
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notifications</Typography>
                    {notifications.length > 0 && (
                        <Button
                            size="small"
                            onClick={handleViewAll}
                            sx={{ textTransform: 'none' }}
                        >
                            View All
                        </Button>
                    )}
                </Box>
                <Divider />
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {notifications.length === 0 ? (
                            <ListItem>
                                <ListItemText
                                    primary="No notifications"
                                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                                />
                            </ListItem>
                        ) : (
                            notifications.slice(0, 5).map((notification, index) => (
                                <React.Fragment key={notification.id || index}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            bgcolor: notification.read ? 'inherit' : 'action.hover',
                                            '&:hover': {
                                                bgcolor: 'action.selected',
                                            },
                                            transition: 'background-color 0.2s',
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar src={notification.senderImage || "/default-avatar.png"} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle2" component="div">
                                                    {notification.message}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {formatNotificationTime(notification.timestamp)}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    {index < Math.min(notifications.length, 5) - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                )}
            </Menu>
        </>
    );
};

export default NotificationList;
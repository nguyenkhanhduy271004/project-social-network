import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    IconButton,
    Badge,
    Menu,
    MenuItem
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDistanceToNow } from 'date-fns';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { API_BASE_URL } from '../config/api';

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

const NotificationItem = ({ notification }) => (
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
                <Typography variant="subtitle1" component="div">
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
);

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { auth } = useSelector(store => store);
    const userId = auth.user?.id;

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
                    setNotifications(prev => [notification, ...prev]);
                } catch (error) {
                    console.error('Error processing notification:', error);
                }
            }
        );
    }, [userId]);

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

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
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

            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="h1">
                        Notifications
                    </Typography>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </Box>
                <Divider />
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={2}>
                    <List sx={{ width: '100%' }}>
                        {notifications.length === 0 ? (
                            <ListItem>
                                <ListItemText
                                    primary="No notifications"
                                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                                />
                            </ListItem>
                        ) : (
                            notifications.map((notification, index) => (
                                <React.Fragment key={notification.id || index}>
                                    <NotificationItem notification={notification} />
                                    {index < notifications.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default Notifications; 
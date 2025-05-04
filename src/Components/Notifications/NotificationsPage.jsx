import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Paper,
    Divider
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { markAllNotificationsRead, clearNotifications } from '../../Store/Notification/Action';

function NotificationsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notifications = useSelector(state => state.notification.notifications);

    useEffect(() => {
        // Mark all notifications as read when entering the page
        dispatch(markAllNotificationsRead());
    }, [dispatch]);

    const handleNotificationClick = (notification) => {
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const handleClearAll = () => {
        dispatch(clearNotifications());
    };

    return (
        <Paper
            sx={{
                maxWidth: 800,
                margin: '0 auto',
                mt: 2,
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Typography variant="h6">Thông báo</Typography>
                {notifications.length > 0 && (
                    <IconButton onClick={handleClearAll} color="primary">
                        <DeleteOutlineIcon />
                    </IconButton>
                )}
            </Box>

            {notifications.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                        Chưa có thông báo nào
                    </Typography>
                </Box>
            ) : (
                <List sx={{ p: 0 }}>
                    {notifications.map((notification, index) => (
                        <React.Fragment key={notification.id}>
                            <ListItem
                                button
                                onClick={() => handleNotificationClick(notification)}
                                sx={{
                                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={notification.sender?.image} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={notification.title}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {notification.message}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ display: 'block', mt: 0.5 }}
                                            >
                                                {formatDistanceToNow(new Date(notification.timestamp), {
                                                    addSuffix: true,
                                                    locale: vi
                                                })}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            {index < notifications.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Paper>
    );
}

export default NotificationsPage; 
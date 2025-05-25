import React from 'react';
import { useSelector } from 'react-redux';
import { Badge } from '@mui/material';
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from "@mui/icons-material/Message";
import GroupIcon from "@mui/icons-material/Group";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PendingIcon from "@mui/icons-material/Pending";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssistantIcon from '@mui/icons-material/Assistant';

// Create a separate component for the notification badge
const NotificationBadge = () => {
    const unreadCount = useSelector(state => state.notification.unreadCount);
    return (
        <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{
                '& .MuiBadge-badge': {
                    right: -3,
                    top: 3,
                }
            }}
        >
            <NotificationsIcon />
        </Badge>
    );
};

const MessageBadge = () => {
    const unreadMessages = useSelector(state => state.chat.unreadMessages || 0);
    return (
        <Badge
            badgeContent={unreadMessages}
            color="error"
            sx={{
                '& .MuiBadge-badge': {
                    right: -3,
                    top: 3,
                }
            }}
        >
            <MessageIcon />
        </Badge>
    );
};

export const navigationMenu = [
    {
        title: 'Trang chủ',
        icon: <HomeIcon />,
        path: '/'
    },
    {
        title: 'AI Chat',
        icon: <AssistantIcon />,
        path: '/ai-chat'
    },
    {
        title: 'Khám phá',
        icon: <ExploreIcon />,
        path: '/explore'
    },
    // {
    //     title: 'Thông báo',
    //     icon: <NotificationsIcon />,
    //     path: '/notifications'
    // },
    {
        title: 'Tin nhắn',
        icon: <MessageIcon />,
        path: '/message'
    },
    {
        title: 'Cộng đồng',
        icon: <GroupIcon />,
        path: '/groups'
    },
    {
        title: 'Trang cá nhân',
        icon: <AccountCircleIcon />,
        path: '/account'
    },
    {
        title: 'Game',
        icon: <SportsEsportsIcon />,
        path: '/game'
    },
    {
        title: 'Xem thêm',
        icon: <PendingIcon />,
        path: '/pending'
    },
    {
        title: 'Quản trị',
        icon: <AdminPanelSettingsIcon />,
        path: '/admin',
        adminOnly: true
    },
    {
        title: 'AI Chat',
        icon: <SmartToyIcon />,
        path: '/admin/ai-chat',
        adminOnly: true
    }
];   
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from "@mui/icons-material/Message";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GroupIcon from "@mui/icons-material/Group";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PendingIcon from "@mui/icons-material/Pending";

export const navigationMenu = [
    {
        title: 'Trang chủ',
        icon: <HomeIcon />,
        path: '/'
    },
    {
        title: 'Khám phá',
        icon: <ExploreIcon />,
        path: '/explore'
    },
    {
        title: 'Thông báo',
        icon: <NotificationsIcon />,
        path: '/notifications'
    },
    {
        title: 'Tin nhắn',
        icon: <MessageIcon />,
        path: '/message'
    },
    {
        title: 'Cộng đồng',
        icon: <GroupIcon />,
        path: '/group'
    },
    {
        title: 'Trang cá nhân',
        icon: <AccountCircleIcon />,
        path: '/account'
    },
    {
        title: 'Xem thêm',
        icon: <PendingIcon />,
        path: '/pending'
    },
]   
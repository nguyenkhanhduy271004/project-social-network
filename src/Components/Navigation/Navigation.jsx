import React, { useEffect, useState } from 'react';
import { navigationMenu } from './NavigationMenu';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Menu, MenuItem, IconButton, Tooltip, Box, Typography } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import logo from '../../images/avatar/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/Auth/Action';
import { useTheme } from '../../theme/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { addNotification } from '../../Store/Notification/Action';
import { API_BASE_URL } from '../../config/api';
import { ToastComponent } from './ToastComponent';
import { removeFromToastList } from '../../Store/Notification/Action';

function Navigation() {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const notifOpen = Boolean(notifAnchorEl);
    const { isDarkMode, toggleTheme } = useTheme();

    const allDeliveredNotifs = useSelector(
        (state) => state.deliveredNotifs.value.notifs
    );

    const notifToastList = useSelector(
        (state) => state.deliveredNotifs.value.notifToastList
    );

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotifClick = (e) => {
        e.stopPropagation();
        setNotifAnchorEl(e.currentTarget);
    };

    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
    };

    useEffect(() => {
        if (auth?.user) {
            const url = `${API_BASE_URL}/push-notifications/${auth.user.id}`;
            const sse = new EventSource(url);

            sse.onopen = () => {
                console.log("Kết nối SSE thành công!");
            };

            sse.addEventListener("user-list-event", (event) => {
                try {
                    const data = JSON.parse(event.data);
                    dispatch(addNotification({ newNotifs: data }));
                } catch (err) {
                    console.error("Error parsing SSE data:", err);
                }
            });

            sse.onerror = (err) => {
                console.warn("Lỗi SSE hoặc đang reconnect:", err);
            };

            return () => {
                sse.close();
            };
        }
    }, [auth, dispatch]);

    if (!auth?.user) {
        return null;
    }

    const filteredMenu = navigationMenu.filter(item =>
        !item.adminOnly || (item.adminOnly && auth.user.isAdmin)
    );

    return (
        <div className='h-screen sticky top-0'>
            <div>
                <div className='py-5 flex items-center justify-between'>
                    <img src={logo} alt="logo" className='w-[60px] h-[60px] rounded-full' />
                    <Tooltip title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}>
                        <IconButton onClick={toggleTheme} sx={{ ml: 1 }}>
                            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Tooltip>
                </div>
                <div className='space-y-6 mt-4'>
                    {filteredMenu.map((item) => (
                        <div
                            key={item.path}
                            className='cursor-pointer flex space-x-3 items-center'
                            onClick={() => navigate(item.path)}
                        >
                            {
                                item.title === "Thông báo" ? (
                                    <Badge badgeContent={allDeliveredNotifs.length} color="error">
                                        {item.icon}
                                    </Badge>
                                ) : item.icon
                            }
                            <p className='text-xl'>{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex items-center justify-between ' style={{ marginTop: '160px' }}>
                <div className='flex items-center space-x-3'>
                    <Avatar
                        alt={auth.user.fullName || 'User'}
                        src={auth.user.image || '/default-avatar.png'}
                        onClick={() => navigate("/account")}
                    />
                    <div>
                        <p>{auth.user.fullName}</p>
                        <span className='opacity-70'>
                            @{auth.user.fullName ? auth.user.fullName.split(" ").join("_").toLowerCase() : "unknown_user"}
                        </span>
                    </div>
                    <Button
                        id="demo-positioned-button"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MoreHoriz />
                    </Button>
                    <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
            <div
                style={{
                    position: "absolute",
                    zIndex: 99,
                    top: 80,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {notifToastList.map((x, index) => (
                    <div key={index} onClick={() => dispatch(removeFromToastList({ notif: x }))}>
                        <ToastComponent notif={x} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Navigation;

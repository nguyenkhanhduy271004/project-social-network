import React, { useEffect, useState } from 'react'
import { navigationMenu } from './NavigationMenu'
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import logo from '../../images/avatar/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Store/Auth/Action';

function Navigation() {
    const { auth } = useSelector(store => store);
    const dispatch = useDispatch();

    const id = auth.user.id;

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        dispatch(logout());
        handleClose();
    }


    return (
        <div className='h-screen sticky top-0'>
            <div>
                <div className='py-5'>
                    <img src={logo} alt="logo" className='w-[60px] h-[60px] rounded-full' />
                </div>
                <div className='space-y-6 mt-4'>
                    {navigationMenu.map((item) =>
                        <div className='cursor-pointer flex space-x-3 items-center' onClick={() => item.title === "Trang cá nhân" ? navigate(`/profile/${id}`) : navigate(item.path)}>
                            {item.icon}
                            <p className='text-xl'>{item.title}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className='flex items-center justify-between mt-56'>
                <div className='flex items-center space-x-3'>
                    <Avatar alt='username' src='https://cdn-icons-png.flaticon.com/512/8345/8345328.png'></Avatar>
                    <div>
                        <p>{auth.user?.fullName}</p>
                        <span className='opacity-70'>
                            @{auth.user?.fullName ? auth.user.fullName.split(" ").join("_").toLowerCase() : "unknown_user"}
                        </span>
                    </div>
                    <Button
                        id="demo-positioned-button"
                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MoreHoriz></MoreHoriz>

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
        </div >
    )
}

export default Navigation

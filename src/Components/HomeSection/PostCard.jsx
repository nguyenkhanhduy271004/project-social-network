import React, { useState } from 'react'
import RepeatIcon from '@mui/icons-material/Repeat';
import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MoreHoriz } from '@mui/icons-material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReplyIcon from '@mui/icons-material/Reply';
function PostCard() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDeletePost = () => {
        console.log("handle delete post")
        handleClose();
    }
    return (
        <div className=''>
            {/* <div className='flex items-center font-semibold text-gray-700 py-2'>
                <RepeatIcon />
                <p>Your post</p>
            </div> */}

            <div className='flex space-x-5'>
                <Avatar
                    onClick={() => navigate(`/profile/${5}`)}
                    className='cursor-pointer'
                    alt='username'
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSNNk7980my9X3TSDyVntzFhngNX4ZwpZI6g&s' />
                <div className='w-full'>
                    <div className='flex justify-between items-center'>
                        <div className='flex cursor-pointer items-center space-x-2'>
                            <span className='font-semibold'>Code with Duy</span>
                            <span className='text-gray-600'>@codewithDuy . 2m</span>
                            <img className='ml-2 w-5 h-5' src="https://cdn-icons-png.flaticon.com/512/6364/6364343.png" alt="content-image" />
                        </div>
                        <div>
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
                                <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
                                <MenuItem onClick={handleDeletePost}>Edit</MenuItem>
                            </Menu>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <div className='cursor-pointer text-left'>
                            <p className='mb-2'>full stack project</p>
                            <img className='w-[28rem] border border-gray-400 p-5 rounded-md'
                                src="https://www.freshbooks.com/wp-content/uploads/2022/02/statement-of-account.jpg"
                                alt="post-image" />
                        </div>
                        <div className='py-5 flex items-center justify-between text-gray-600'>
                            <div className='flex space-x-5'>
                                <div className='flex items-center space-x-2 cursor-pointer hover:text-blue-500 transition'>
                                    <ChatBubbleOutlineIcon fontSize="small" />
                                    <p className='text-sm'>43</p>
                                </div>

                                <div className='flex items-center space-x-2 cursor-pointer hover:text-red-500 transition'>
                                    <FavoriteBorderIcon fontSize="small" />
                                    <p className='text-sm'>43</p>
                                </div>

                                <div className='flex items-center space-x-2 cursor-pointer hover:text-green-500 transition'>
                                    <RepeatIcon fontSize="small" />
                                    <p className='text-sm'>Share</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default PostCard

import React, { useEffect, useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PostCard from '../HomeSection/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersPost } from '../../Store/Post/Action';
function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth, post } = useSelector(store => store);
    const handleBack = () => {
        navigate(-1);
    }
    const handleOpenProfileModal = () => {

    }

    const handleFollowUser = () => {

    }

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        dispatch(getUsersPost(auth.user?.id));
        console.log(post.posts)
    }, [])
    return (
        <div>
            <section className={`z-50 flex items-center sticky top-0 bg-opacity-95`}>
                <KeyboardBackspaceIcon className='cursor-pointer' onClick={handleBack} />
                <h1 className='py-5 text-xl font-bold opacity-90 ml-5'>{auth.user?.fullName}</h1>
            </section>
            <section>
                <img className='w-[100%] h-[15rem] objective-cover' src="https://www.anhrgroup.com/sites/default/files/styles/inner_pages_slideshow/public/basic-pages/al-nahda-samar-restaurant-1.jpg?itok=GkrSRo1S" alt="" />
            </section>
            <section className='pl-6'>
                <div className='flex justify-between items-start mt-5 h-[5rem]'>
                    <Avatar className='transform -translate-y-24' alt='avatar' src='https://cdn-icons-png.flaticon.com/512/8345/8345328.png' sx={{ width: "10rem", height: "10rem", border: "4px solid white" }} />
                    {true
                        ? <Button className='rounded-full' variant='contained' sx={{ borderRadius: "20px" }} onClick={handleOpenProfileModal}>Edit profile</Button>
                        : <Button className='rounded-full' variant='contained' sx={{ borderRadius: "20px" }} onClick={handleFollowUser}>Follow user</Button>
                    }

                </div>
                <div>
                    <div className='flex items-center'>
                        <h1 className='font-bold text-lg'>{auth.user?.fullName}</h1>
                        <img className='ml-2 w-5 h-5' src="https://cdn-icons-png.flaticon.com/512/6364/6364343.png" alt="content-image" />
                    </div>
                    <h1 className='text-gray-500'>@{auth.user?.fullName ? auth.user.fullName.split(" ").join("_").toLowerCase() : "unknown_user"}</h1>
                </div>
                <div className='mt-2 space-y-3'>
                    <p>{auth.user?.bio}</p>
                    <div className='py-1 flex space-x-5'>
                        <div className='flex items-center'>
                            <BusinessCenterIcon />
                            <p className='ml-2'>Education</p>
                        </div>
                        <div className='flex items-center'>
                            <LocationOnIcon />
                            <p className='ml-2'>{auth.user?.location}</p>
                        </div>
                        <div className='flex items-center'>
                            <CalendarMonthIcon />
                            <p className='ml-2'>{auth.user?.birthDate}</p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-5'>
                        <div className='flex items-center space-x-1 font-semibold'>
                            <span>{auth.user?.following.length}</span>
                            <span className='text-gray-500'>Following</span>
                        </div>
                        <div className='flex items-center space-x-1 font-semibold'>
                            <span>{auth.user?.followers.length}</span>
                            <span className='text-gray-500'>Followers</span>
                        </div>
                    </div>

                </div>
            </section>
            <section>
                <Box className="mt-4" sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Post" value="1" />
                                <Tab label="Image" value="2" />
                                <Tab label="Saved" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            {post.posts && post.posts.length > 0 ? (
                                post.posts.map((post) => <PostCard key={post.id} post={post} />)
                            ) : (
                                <p className="text-gray-500">No posts available.</p>
                            )}
                        </TabPanel>
                        <TabPanel value="2">Item Two</TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </Box>
            </section>
        </div>
    )
}

export default Profile

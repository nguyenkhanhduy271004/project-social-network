import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate, useParams } from 'react-router-dom';
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
import { findUserById, followUser, updateUserProfile } from '../../Store/Auth/Action';

function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(store => store.auth.findUser);
    const posts = useSelector(store => store.post.posts);
    const auth = useSelector(store => store.auth.user);
    useEffect(() => {
        dispatch(findUserById(id));
        dispatch(getUsersPost(id));
    }, [dispatch, id])
    const [selectedPost, setSelectedPost] = useState(null);
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        location: user?.location || '',
        website: user?.website || '',
        birthDate: user?.birthDate || '',
        password: '',
        mobile: user?.mobile || '',
        image: user?.image || '',
        backgroundImage: user?.backgroundImage || '',
        bio: user?.bio || '',
    });
    const [openFollowingModal, setOpenFollowingModal] = useState(false);
    const [followingList, setFollowingList] = useState([]);


    const handleOpenFollowingModal = () => {
        setFollowingList(user?.following || []);
        setOpenFollowingModal(true);
    };

    const handleCloseFollowingModal = () => {
        setOpenFollowingModal(false);
    };

    const handleOpenPostModal = (post) => {
        console.log(post);
        setSelectedPost(post);
        setOpenModal1(true);
    };

    const handleClosePostModal = () => {
        setOpenModal1(false);
        setSelectedPost(null);
    };

    const handleBack = () => {
        navigate(-1);
    };


    const handleCloseProfileModal = () => {
        setOpenModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        dispatch(updateUserProfile(formData));
        setOpenModal(false);
    };

    const [value, setValue] = useState('1');

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleFollowUser = (userId) => {
        dispatch(followUser(userId));
    }

    return (
        <div>
            <section className="z-50 flex items-center sticky top-0 bg-opacity-95">
                <KeyboardBackspaceIcon className="cursor-pointer" onClick={handleBack} />
                <h1 className="py-5 text-xl font-bold opacity-90 ml-5">{user?.fullName}</h1>
            </section>

            <section>
                <img
                    className="w-[100%] h-[15rem] object-cover"
                    src="https://www.anhrgroup.com/sites/default/files/styles/inner_pages_slideshow/public/basic-pages/al-nahda-samar-restaurant-1.jpg?itok=GkrSRo1S"
                    alt=""
                />
            </section>
            <section className="pl-6">
                <div className="flex justify-between items-start mt-5 h-[5rem]">
                    <Avatar
                        className="transform -translate-y-24"
                        alt="avatar"
                        src={user?.image || "https://cdn-icons-png.flaticon.com/512/8345/8345328.png"}
                        sx={{ width: '10rem', height: '10rem', border: '4px solid white' }}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button className="rounded-full" variant="contained" sx={{ borderRadius: '20px' }}>Nhắn tin</Button>
                        <Button className="rounded-full" variant="contained" sx={{ borderRadius: '20px' }} onClick={() => handleFollowUser(user?.id)}>
                            {user?.followers.some(follower => follower.id === auth.id) ? (
                                <span className="cursor-pointer">Following</span>
                            ) : (
                                <span className="cursor-pointer">Follow</span>
                            )}
                        </Button>
                    </Box>

                </div>
                <div>
                    <div className="flex items-center">
                        <h1 className="font-bold text-lg">{user?.fullName}</h1>
                        <img className="ml-2 w-5 h-5" src="https://cdn-icons-png.flaticon.com/512/6364/6364343.png" alt="content" />
                    </div>
                    <h1 className="text-gray-500">@{user?.fullName ? user.fullName.split(' ').join('_').toLowerCase() : 'unknown_user'}</h1>
                </div>
                <div className="mt-2 space-y-3">
                    <p>{user?.bio}</p>
                    <div className="py-1 flex space-x-5">
                        <div className="flex items-center">
                            <BusinessCenterIcon />
                            <p className="ml-2">Education</p>
                        </div>
                        <div className="flex items-center">
                            <LocationOnIcon />
                            <p className="ml-2">{user?.location}</p>
                        </div>
                        <div className="flex items-center">
                            <CalendarMonthIcon />
                            <p className="ml-2">{user?.birthDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-5">
                        <div className="flex items-center space-x-1 font-semibold">
                            <span>{user?.following.length}</span>
                            <span className="text-gray-500 cursor-pointer" onClick={handleOpenFollowingModal}>
                                Following
                            </span>
                        </div>
                        <div className="flex items-center space-x-1 font-semibold">
                            <span>{user?.followers.length}</span>
                            <span className="text-gray-500">Followers</span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <Box className="mt-4" sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab label="Post" value="1" />
                                <Tab label="Image" value="2" />
                                <Tab label="Saved" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            {posts && posts.length > 0 ? (
                                posts.map((post) => <PostCard key={post.id} post={post} />)
                            ) : (
                                <p className="text-gray-500">No posts available.</p>
                            )}
                        </TabPanel>
                        <TabPanel value="2">
                            {posts && posts.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {posts.map((post, index) => (
                                        post.image ? (
                                            <img
                                                key={index}
                                                src={post.image}
                                                alt={`Post ${index}`}
                                                className="w-32 h-32 object-cover"
                                                onClick={() => handleOpenPostModal(post)}
                                            />
                                        ) : null
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No images available.</p>
                            )}
                        </TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </Box>
            </section>

            <Dialog open={openModal} onClose={handleCloseProfileModal}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Full Name"
                        variant="outlined"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        variant="outlined"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Website"
                        variant="outlined"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Birth Date"
                        variant="outlined"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Mobile"
                        variant="outlined"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Bio"
                        variant="outlined"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProfileModal} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openModal1} onClose={handleClosePostModal} maxWidth="md">
                <DialogTitle>Post Details</DialogTitle>
                <DialogContent>
                    {selectedPost ? (
                        <PostCard post={selectedPost} />
                    ) : (
                        <p>Loading post details...</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePostModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openFollowingModal} onClose={handleCloseFollowingModal}>
                <DialogTitle>Following List</DialogTitle>
                <DialogContent>
                    {followingList.length > 0 ? (
                        followingList.map((user, index) => (
                            <div key={index} className="flex justify-between items-center py-2">
                                <div className="flex items-center">
                                    <Avatar alt={user.name} src={user.avatar} />
                                    <span className="ml-3">{user.fullName}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">You are not following anyone yet.</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFollowingModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default Profile;

import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PostCard from '../HomeSection/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getRepost, getUsersPost } from '../../Store/Post/Action';
import { updateUserProfile, followUser } from '../../Store/Auth/Action';

function Account() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth, post } = useSelector(store => store);
    const [selectedPost, setSelectedPost] = useState(null);
    const [openPostModal, setOpenPostModal] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openFollowingModal, setOpenFollowingModal] = useState(false);
    const [openFollowersModal, setOpenFollowersModal] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const rePosts = useSelector(store => store.post.rePost);
    const [formData, setFormData] = useState({
        fullName: auth.user?.fullName || '',
        location: auth.user?.location || '',
        website: auth.user?.website || '',
        birthDate: auth.user?.birthDate || '',
        password: '',
        mobile: auth.user?.mobile || '',
        image: auth.user?.image || '',
        backgroundImage: auth.user?.backgroundImage || '',
        bio: auth.user?.bio || '',
    });
    const [tabValue, setTabValue] = useState('1');
    const [previewImage, setPreviewImage] = useState(null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    useEffect(() => {
        dispatch(getUsersPost(auth.user?.id));
        dispatch(getRepost());
    }, [dispatch, auth.user?.id]);

    const handleBack = () => navigate(-1);

    const handleOpenProfileModal = () => setOpenProfileModal(true);
    const handleCloseProfileModal = () => setOpenProfileModal(false);

    const handleOpenPostModal = (post) => {
        setSelectedPost(post);
        setOpenPostModal(true);
    };
    const handleClosePostModal = () => {
        setOpenPostModal(false);
        setSelectedPost(null);
    };

    const handleOpenFollowingModal = () => {
        setFollowingList(auth.user?.following || []);
        setOpenFollowingModal(true);
    };
    const handleCloseFollowingModal = () => setOpenFollowingModal(false);

    const handleOpenFollowersModal = () => {
        setFollowersList(auth.user?.followers || []);
        setOpenFollowersModal(true);
    };

    const handleCloseFollowersModal = () => setOpenFollowersModal(false);

    const handleFollowUser = (userId) => {
        dispatch(followUser(userId));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsImageLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData(prev => ({ ...prev, image: file }));
                setIsImageLoading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();

            const userData = {
                fullName: formData.fullName,
                location: formData.location,
                website: formData.website,
                birthDate: formData.birthDate,
                mobile: formData.mobile,
                bio: formData.bio
            };

            formDataToSend.append('req', new Blob([JSON.stringify(userData)], {
                type: 'application/json'
            }));

            if (formData.image instanceof File) {
                formDataToSend.append('image', formData.image);
            }

            const response = await dispatch(updateUserProfile(formDataToSend));

            if (response.status === 200) {
                setFormData({
                    ...formData,
                    fullName: response.data.data.fullName,
                    location: response.data.data.location,
                    website: response.data.data.website,
                    birthDate: response.data.data.birthDate,
                    mobile: response.data.data.mobile,
                    bio: response.data.data.bio,
                    image: response.data.data.image
                });
                handleCloseProfileModal();
            }
        } catch (error) {
            console.error('Update profile error:', error);
        }
    };

    const handleTabChange = (event, newValue) => setTabValue(newValue);

    return (
        <div >
            <section className="z-50 flex items-center sticky top-0 bg-opacity-95">
                <KeyboardBackspaceIcon className="cursor-pointer" onClick={handleBack} />
                <h1 className="py-5 text-xl font-bold opacity-90 ml-5">{auth.user?.fullName}</h1>
            </section>

            <section>
                <img className="w-[100%] h-[15rem] object-cover" src="https://www.anhrgroup.com/sites/default/files/styles/inner_pages_slideshow/public/basic-pages/al-nahda-samar-restaurant-1.jpg?itok=GkrSRo1S" alt="" />
            </section>

            <section className="pl-6">
                <div className="flex justify-between items-start mt-5 h-[5rem]">
                    <Avatar className="transform -translate-y-24" alt="avatar" src={auth.user?.image || "https://cdn-icons-png.flaticon.com/512/8345/8345328.png"} sx={{ width: '10rem', height: '10rem', border: '4px solid white' }} />
                    <Button className="rounded-full" variant="contained" sx={{ borderRadius: '20px' }} onClick={handleOpenProfileModal}>Edit profile</Button>
                </div>
                <div>
                    <div className="flex items-center">
                        <h1 className="font-bold text-lg">{auth.user?.fullName}</h1>
                        <img className="ml-2 w-5 h-5" src="https://cdn-icons-png.flaticon.com/512/6364/6364343.png" alt="content-image" />
                    </div>
                    <h1 className="text-gray-500">@{auth.user?.fullName ? auth.user.fullName.split(' ').join('_').toLowerCase() : 'unknown_user'}</h1>
                </div>
                <div className="mt-2 space-y-3">
                    <p>{auth.user?.bio}</p>
                    <div className="py-1 flex space-x-5">
                        <div className="flex items-center"><BusinessCenterIcon /><p className="ml-2">Education</p></div>
                        <div className="flex items-center"><LocationOnIcon /><p className="ml-2">{auth.user?.location}</p></div>
                        <div className="flex items-center"><CalendarMonthIcon /><p className="ml-2">{auth.user?.birthDate}</p></div>
                    </div>
                    <div className="flex items-center space-x-5">
                        <div className="flex items-center space-x-1 font-semibold">
                            <span>{auth.user?.following.length}</span>
                            <span className="text-gray-500 cursor-pointer" onClick={handleOpenFollowingModal}>Followings</span>
                        </div>
                        <div className="flex items-center space-x-1 font-semibold">
                            <span>{auth.user?.followers.length}</span>
                            <span
                                className="text-gray-500 cursor-pointer hover:text-blue-500"
                                onClick={handleOpenFollowersModal}
                            >
                                Followers
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <Box className="mt-4" sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab label="Post" value="1" />
                                <Tab label="Image" value="2" />
                                <Tab label="Saved" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            {post.posts?.length > 0 ? post.posts.map(post => <div className="w-[800px] mx-auto"><PostCard key={post.id} post={post} /></div>) : <p className="text-gray-500">No posts available.</p>}
                        </TabPanel>
                        <TabPanel value="2">
                            {post.posts?.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {post.posts.map((post, index) => post.image && <img key={index} src={post.image} alt={`Post ${index}`} className="w-32 h-32 object-cover" onClick={() => handleOpenPostModal(post)} />)}
                                </div>
                            ) : <p className="text-gray-500">No images available.</p>}
                        </TabPanel>
                        <TabPanel value="3">
                            {rePosts.length > 0 ? rePosts.map(post => <div className="w-[800px] mx-auto"><PostCard key={post.id} post={post} /></div>) : <p className="text-gray-500">No posts available.</p>}
                        </TabPanel>
                    </TabContext>
                </Box>
            </section>

            <Dialog open={openProfileModal} onClose={handleCloseProfileModal} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <Avatar
                                src={previewImage || formData.image}
                                alt="Profile preview"
                                sx={{ width: 120, height: 120, border: '2px solid #e0e0e0' }}
                            />
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="profile-image-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="profile-image-upload">
                                <IconButton
                                    component="span"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                    }}
                                >
                                    <AddPhotoAlternateIcon />
                                </IconButton>
                            </label>
                            {previewImage && (
                                <IconButton
                                    onClick={handleRemoveImage}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        backgroundColor: 'error.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'error.dark',
                                        },
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" align="center">
                            Click the camera icon to change your profile picture
                        </Typography>
                    </Box>

                    {['fullName', 'location', 'website', 'birthDate', 'mobile', 'bio'].map(field => (
                        <TextField
                            key={field}
                            fullWidth
                            margin="normal"
                            label={field.replace(/([A-Z])/g, ' $1').trim()}
                            variant="outlined"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProfileModal} color="primary">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        disabled={isImageLoading}
                    >
                        {isImageLoading ? 'Uploading...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openPostModal} onClose={handleClosePostModal} maxWidth="md">
                <DialogTitle>Post Details</DialogTitle>
                <DialogContent>{selectedPost ? <PostCard post={selectedPost} /> : <p>Loading post details...</p>}</DialogContent>
                <DialogActions><Button onClick={handleClosePostModal} color="primary">Close</Button></DialogActions>
            </Dialog>

            <Dialog
                open={openFollowingModal}
                onClose={handleCloseFollowingModal}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxWidth: '400px',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 2
                }}>
                    Following
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    {followingList.length > 0 ? (
                        followingList.map((following) => (
                            <Box
                                key={following.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                    '&:last-child': {
                                        borderBottom: 'none'
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/profile/${following.id}`)}
                                >
                                    <Avatar
                                        src={following.image || "/default-avatar.png"}
                                        alt={following.fullName}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {following.fullName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            @{following.fullName?.split(' ').join('_').toLowerCase()}
                                        </Typography>
                                    </Box>
                                </Box>
                                {auth.user.id !== following.id && (
                                    <Button
                                        variant={following.followers?.some(f => f.id === auth.user.id) ? "outlined" : "contained"}
                                        size="small"
                                        onClick={() => handleFollowUser(following.id)}
                                        sx={{
                                            borderRadius: 6,
                                            minWidth: '100px',
                                            textTransform: 'none',
                                            fontWeight: 500
                                        }}
                                    >
                                        {following.followers?.some(f => f.id === auth.user.id) ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Chưa theo dõi ai.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={openFollowersModal}
                onClose={handleCloseFollowersModal}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        maxWidth: '400px',
                        width: '100%'
                    }
                }}
            >
                <DialogTitle sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    pb: 2
                }}>
                    Followers
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    {followersList.length > 0 ? (
                        followersList.map((follower) => (
                            <Box
                                key={follower.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                                    '&:last-child': {
                                        borderBottom: 'none'
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/profile/${follower.id}`)}
                                >
                                    <Avatar
                                        src={follower.image || "/default-avatar.png"}
                                        alt={follower.fullName}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {follower.fullName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            @{follower.fullName?.split(' ').join('_').toLowerCase()}
                                        </Typography>
                                    </Box>
                                </Box>
                                {auth.user.id !== follower.id && (
                                    <Button
                                        variant={follower.followers?.some(f => f.id === auth.user.id) ? "outlined" : "contained"}
                                        size="small"
                                        onClick={() => handleFollowUser(follower.id)}
                                        sx={{
                                            borderRadius: 6,
                                            minWidth: '100px',
                                            textTransform: 'none',
                                            fontWeight: 500
                                        }}
                                    >
                                        {follower.followers?.some(f => f.id === auth.user.id) ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Chưa có người theo dõi nào.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Account;
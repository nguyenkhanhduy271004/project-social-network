import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, IconButton, Paper } from '@mui/material';
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
import PostCard from '../features/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getRepost, getUsersPost } from '../../Store/actions/post';
import { updateUserProfile, followUser } from '../../Store/actions/auth';
import { RootState, Post, User } from '../../types';
import { AppDispatch } from '../../Store/index';

interface FormData {
    fullName: string;
    location: string;
    website: string;
    birthDate: string;
    password: string;
    mobile: string;
    image: string | File;
    backgroundImage: string;
    bio: string;
}

const Account: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { auth, post } = useSelector((state: RootState) => state);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [openPostModal, setOpenPostModal] = useState(false);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openFollowingModal, setOpenFollowingModal] = useState(false);
    const [openFollowersModal, setOpenFollowersModal] = useState(false);
    const [followingList, setFollowingList] = useState<User[]>([]);
    const [followersList, setFollowersList] = useState<User[]>([]);
    const rePosts = useSelector((state: RootState) => state.post.rePost);
    const [formData, setFormData] = useState<FormData>({
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
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    useEffect(() => {
        if (auth.user?.id) {
            dispatch(getUsersPost(auth.user.id));
            dispatch(getRepost());
        }
    }, [dispatch, auth.user?.id]);

    const handleBack = () => navigate(-1);

    const handleOpenProfileModal = () => setOpenProfileModal(true);
    const handleCloseProfileModal = () => setOpenProfileModal(false);

    const handleOpenPostModal = (post: Post) => {
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

    const handleFollowUser = (userId: string) => {
        dispatch(followUser(userId));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsImageLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
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

            const response = await dispatch(updateUserProfile(formDataToSend)).unwrap();

            setFormData({
                ...formData,
                fullName: response.fullName,
                location: response.location || '',
                website: response.website || '',
                birthDate: response.birthDate || '',
                mobile: response.mobile || '',
                bio: response.bio || '',
                image: response.image || ''
            });
            handleCloseProfileModal();
        } catch (error) {
            console.error('Update profile error:', error);
        }
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => setTabValue(newValue);

    return (
        <div className="max-w-4xl mx-auto bg-white">
            <section className="z-50 flex items-center sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm">
                <IconButton onClick={handleBack} className="hover:bg-gray-100">
                    <KeyboardBackspaceIcon />
                </IconButton>
                <h1 className="py-4 text-xl font-bold ml-2">{auth.user?.fullName}</h1>
            </section>

            <section className="relative">
                <img
                    className="w-full h-[20rem] object-cover"
                    src={auth.user?.backgroundImage || "https://www.anhrgroup.com/sites/default/files/styles/inner_pages_slideshow/public/basic-pages/al-nahda-samar-restaurant-1.jpg?itok=GkrSRo1S"}
                    alt="Cover"
                />
            </section>

            <section className="px-6 relative">
                <div className="flex justify-between items-start -mt-16">
                    <Avatar
                        className="transform border-4 border-white shadow-lg transition-transform hover:scale-105"
                        alt="avatar"
                        src={auth.user?.image || "https://cdn-icons-png.flaticon.com/512/8345/8345328.png"}
                        sx={{ width: '10rem', height: '10rem' }}
                    />
                    <Button
                        className="mt-4 rounded-full transition-all hover:shadow-md"
                        variant="contained"
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            px: 3,
                            py: 1
                        }}
                        onClick={handleOpenProfileModal}
                    >
                        Edit profile
                    </Button>
                </div>

                <div className="mt-4">
                    <div className="flex items-center">
                        <h1 className="font-bold text-2xl">{auth.user?.fullName}</h1>
                        <img className="ml-2 w-5 h-5" src="https://cdn-icons-png.flaticon.com/512/6364/6364343.png" alt="verified" />
                    </div>
                    <h1 className="text-gray-500 text-lg">@{auth.user?.fullName ? auth.user.fullName.split(' ').join('_').toLowerCase() : 'unknown_user'}</h1>
                </div>

                <div className="mt-4 space-y-4">
                    <p className="text-gray-700 text-lg">{auth.user?.bio}</p>
                    <div className="py-2 flex flex-wrap gap-6">
                        <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <BusinessCenterIcon className="mr-2" />
                            <p>Education</p>
                        </div>
                        <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <LocationOnIcon className="mr-2" />
                            <p>{auth.user?.location}</p>
                        </div>
                        <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <CalendarMonthIcon className="mr-2" />
                            <p>{auth.user?.birthDate}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2 font-semibold">
                            <span className="text-lg">{auth.user?.following?.length || 0}</span>
                            <span
                                className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
                                onClick={handleOpenFollowingModal}
                            >
                                Following
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 font-semibold">
                            <span className="text-lg">{auth.user?.followers?.length || 0}</span>
                            <span
                                className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"
                                onClick={handleOpenFollowersModal}
                            >
                                Followers
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6">
                <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabContext value={tabValue}>
                        <Box sx={{ width: '100%' }}>
                            <TabList
                                onChange={handleTabChange}
                                aria-label="profile tabs"
                                sx={{
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        minWidth: 100,
                                        '&.Mui-selected': {
                                            color: 'primary.main',
                                        },
                                    },
                                }}
                            >
                                <Tab label="Posts" value="1" />
                                <Tab label="Images" value="2" />
                                <Tab label="Saved" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1" sx={{ p: 3 }}>
                            {post.posts?.length > 0 ? (
                                <div className="space-y-4">
                                    {post.posts.map(post => (
                                        <div key={post.id} className="w-full">
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        No posts available.
                                    </Typography>
                                </Box>
                            )}
                        </TabPanel>
                        <TabPanel value="2" sx={{ p: 3 }}>
                            {post.posts?.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {post.posts.map((post, index) => post.image && (
                                        <div
                                            key={index}
                                            className="relative aspect-square cursor-pointer group"
                                            onClick={() => handleOpenPostModal(post)}
                                        >
                                            <img
                                                src={post.image}
                                                alt={`Post ${index}`}
                                                className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        No images available.
                                    </Typography>
                                </Box>
                            )}
                        </TabPanel>
                        <TabPanel value="3" sx={{ p: 3 }}>
                            {rePosts.length > 0 ? (
                                <div className="space-y-4">
                                    {rePosts.map(post => (
                                        <div key={post.id} className="w-full">
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">
                                        No saved posts available.
                                    </Typography>
                                </Box>
                            )}
                        </TabPanel>
                    </TabContext>
                </Paper>
            </section>

            <Dialog open={openProfileModal} onClose={handleCloseProfileModal} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <Avatar
                                src={previewImage || formData.image as string}
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
                            value={formData[field as keyof FormData]}
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
                                {auth.user?.id !== following.id && (
                                    <Button
                                        variant={following.followers?.some(f => f.id === auth.user?.id) ? "outlined" : "contained"}
                                        size="small"
                                        onClick={() => handleFollowUser(following.id)}
                                        sx={{
                                            borderRadius: 6,
                                            minWidth: '100px',
                                            textTransform: 'none',
                                            fontWeight: 500
                                        }}
                                    >
                                        {following.followers?.some(f => f.id === auth.user?.id) ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                No following yet.
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
                                {auth.user?.id !== follower.id && (
                                    <Button
                                        variant={follower.followers?.some(f => f.id === auth.user?.id) ? "outlined" : "contained"}
                                        size="small"
                                        onClick={() => handleFollowUser(follower.id)}
                                        sx={{
                                            borderRadius: 6,
                                            minWidth: '100px',
                                            textTransform: 'none',
                                            fontWeight: 500
                                        }}
                                    >
                                        {follower.followers?.some(f => f.id === auth.user?.id) ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                No followers yet.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Account; 
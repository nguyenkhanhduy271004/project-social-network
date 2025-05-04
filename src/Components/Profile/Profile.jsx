import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Paper,
    Typography,
    Box,
    Tab,
    IconButton,
    Skeleton,
    Tooltip,
    Fade,
    Container,
    Divider
} from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate, useParams } from 'react-router-dom';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PostCard from '../HomeSection/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getRepost, getUsersPost } from '../../Store/Post/Action';
import { findUserById, followUser, updateUserProfile } from '../../Store/Auth/Action';
import { useTheme } from '../../theme/ThemeContext';
import { ImageGridSkeleton, ProfileSkeleton } from '../Common/LoadingStates';

function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(store => store.auth.findUser);
    const posts = useSelector(store => store.post.posts);
    const auth = useSelector(store => store.auth.user);
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [openModal1, setOpenModal1] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
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
    const [openFollowersModal, setOpenFollowersModal] = useState(false);
    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);

    const isFollowing = user?.followers.some(follower => follower.id === auth.id);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                console.log('Fetching user data for ID:', id);
                await Promise.all([
                    dispatch(findUserById(id)),
                    dispatch(getUsersPost(id)),
                    dispatch(getRepost())
                ]);
                console.log('User data loaded:', user);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [dispatch, id]);

    const handleOpenFollowingModal = () => {
        setFollowingList(user?.following || []);
        setOpenFollowingModal(true);
    };

    const handleCloseFollowingModal = () => {
        setOpenFollowingModal(false);
    };

    const handleOpenFollowersModal = () => {
        console.log('Opening followers modal');
        console.log('User followers:', user?.followers);
        setFollowersList(user?.followers || []);
        setOpenFollowersModal(true);
    };

    const handleCloseFollowersModal = () => {
        console.log('Closing followers modal');
        setOpenFollowersModal(false);
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
        <Container maxWidth="md">
            <Paper
                elevation={0}
                sx={{
                    backgroundColor: isDarkMode ? 'background.paper' : 'white',
                    color: isDarkMode ? 'text.primary' : 'inherit',
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: 3
                }}
            >
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 50,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: isDarkMode ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        borderBottom: 1,
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'divider'
                    }}
                >
                    <IconButton
                        onClick={handleBack}
                        sx={{
                            color: isDarkMode ? 'text.primary' : 'inherit',
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        <KeyboardBackspaceIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {isLoading ? <Skeleton width={150} /> : user?.fullName}
                    </Typography>
                </Box>

                {isLoading ? (
                    <ProfileSkeleton />
                ) : (
                    <>
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                component="img"
                                src={user?.backgroundImage || "https://www.anhrgroup.com/sites/default/files/styles/inner_pages_slideshow/public/basic-pages/al-nahda-samar-restaurant-1.jpg?itok=GkrSRo1S"}
                                alt="Cover"
                                sx={{
                                    width: '100%',
                                    height: 240,
                                    objectFit: 'cover',
                                    borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : 'none'
                                }}
                            />
                            <Avatar
                                src={user?.image || "https://cdn-icons-png.flaticon.com/512/8345/8345328.png"}
                                sx={{
                                    width: 160,
                                    height: 160,
                                    border: isDarkMode ? '4px solid rgba(18, 18, 18, 0.9)' : '4px solid white',
                                    position: 'absolute',
                                    bottom: -80,
                                    left: 24,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }}
                            />
                        </Box>

                        <Box sx={{ mt: 10, p: 3 }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                                mb: 3
                            }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: 6,
                                        px: 3,
                                        backgroundColor: isDarkMode ? 'primary.dark' : 'primary.main',
                                        '&:hover': {
                                            backgroundColor: isDarkMode ? 'primary.main' : 'primary.dark'
                                        }
                                    }}
                                    onClick={() => navigate("/message")}
                                >
                                    Nhắn tin
                                </Button>
                                <Button
                                    variant={isFollowing ? "outlined" : "contained"}
                                    sx={{
                                        borderRadius: 6,
                                        px: 3,
                                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'primary.main',
                                        color: isFollowing ? (isDarkMode ? 'text.primary' : 'inherit') : 'white',
                                        '&:hover': {
                                            backgroundColor: isFollowing ?
                                                (isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)') :
                                                (isDarkMode ? 'primary.dark' : 'primary.dark')
                                        }
                                    }}
                                    onClick={() => handleFollowUser(user?.id)}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    {isFollowing ? (
                                        isHovered ? "Unfollow" : "Following"
                                    ) : "Follow"}
                                </Button>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                        {user?.fullName}
                                    </Typography>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/6364/6364343.png"
                                        alt="Verified"
                                        style={{ width: 20, height: 20 }}
                                    />
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: isDarkMode ? 'text.secondary' : 'text.secondary',
                                        mb: 2
                                    }}
                                >
                                    @{user?.fullName ? user.fullName.split(' ').join('_').toLowerCase() : 'unknown_user'}
                                </Typography>

                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    {user?.bio}
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    gap: 3,
                                    mb: 2,
                                    color: isDarkMode ? 'text.secondary' : 'text.secondary'
                                }}>
                                    {user?.location && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOnIcon fontSize="small" />
                                            <Typography variant="body2">{user.location}</Typography>
                                        </Box>
                                    )}
                                    {user?.birthDate && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarMonthIcon fontSize="small" />
                                            <Typography variant="body2">{user.birthDate}</Typography>
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Box
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                '& .MuiTypography-root': {
                                                    color: isDarkMode ? 'primary.main' : 'primary.main'
                                                }
                                            }
                                        }}
                                        onClick={handleOpenFollowingModal}
                                    >
                                        <Typography component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                                            {user?.following.length}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: isDarkMode ? 'text.secondary' : 'text.secondary'
                                            }}
                                        >
                                            Following
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                '& .MuiTypography-root': {
                                                    color: isDarkMode ? 'primary.main' : 'primary.main'
                                                }
                                            }
                                        }}
                                        onClick={() => {
                                            console.log('Followers box clicked');
                                            handleOpenFollowersModal();
                                        }}
                                    >
                                        <Typography component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                                            {user?.followers.length}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: isDarkMode ? 'text.secondary' : 'text.secondary'
                                            }}
                                        >
                                            Followers
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{
                                my: 3,
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'divider'
                            }} />

                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'divider' }}>
                                    <TabList
                                        onChange={handleTabChange}
                                        sx={{
                                            '& .MuiTab-root': {
                                                color: isDarkMode ? 'text.secondary' : 'text.secondary',
                                                '&.Mui-selected': {
                                                    color: isDarkMode ? 'primary.main' : 'primary.main'
                                                }
                                            },
                                            '& .MuiTabs-indicator': {
                                                backgroundColor: isDarkMode ? 'primary.main' : 'primary.main'
                                            }
                                        }}
                                    >
                                        <Tab label="Bài viết" value="1" />
                                        <Tab label="Ảnh" value="2" />
                                        <Tab label="Đã lưu" value="3" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1" sx={{ px: 0 }}>
                                    {posts && posts.length > 0 ? (
                                        posts.map((post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    ) : (
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                py: 6,
                                                color: isDarkMode ? 'text.secondary' : 'text.secondary'
                                            }}
                                        >
                                            <Typography variant="body1">
                                                Chưa có bài viết nào
                                            </Typography>
                                        </Box>
                                    )}
                                </TabPanel>
                                <TabPanel value="2">
                                    {isLoading ? (
                                        <ImageGridSkeleton />
                                    ) : posts && posts.length > 0 ? (
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
                                                gap: 2
                                            }}
                                        >
                                            {posts.map((post, index) => (
                                                post.image && (
                                                    <Box
                                                        key={post.id || index}
                                                        component="img"
                                                        src={post.image}
                                                        alt={`Post ${index + 1}`}
                                                        sx={{
                                                            width: '100%',
                                                            height: 128,
                                                            objectFit: 'cover',
                                                            borderRadius: 1,
                                                            cursor: 'pointer',
                                                            transition: 'transform 0.2s',
                                                            '&:hover': {
                                                                transform: 'scale(1.02)',
                                                            }
                                                        }}
                                                        onClick={() => handleOpenPostModal(post)}
                                                    />
                                                )
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                textAlign: 'center',
                                                py: 6,
                                                color: isDarkMode ? 'text.secondary' : 'text.secondary'
                                            }}
                                        >
                                            <Typography variant="body1">
                                                Chưa có ảnh nào
                                            </Typography>
                                        </Box>
                                    )}
                                </TabPanel>
                                <TabPanel value="3">Item Three</TabPanel>
                            </TabContext>
                        </Box>
                    </>
                )}
            </Paper>

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
                        followingList.map((following) => (
                            <Box
                                key={following.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    py: 2,
                                    borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
                                    '&:last-child': {
                                        borderBottom: 'none'
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar
                                        src={following.image || "/default-avatar.png"}
                                        alt={following.fullName}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1">{following.fullName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            @{following.fullName?.split(' ').join('_').toLowerCase()}
                                        </Typography>
                                    </Box>
                                </Box>
                                {auth.id !== following.id && (
                                    <Button
                                        variant={following.followers?.some(f => f.id === auth.id) ? "outlined" : "contained"}
                                        size="small"
                                        onClick={() => handleFollowUser(following.id)}
                                        sx={{ borderRadius: 6 }}
                                    >
                                        {following.followers?.some(f => f.id === auth.id) ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Chưa theo dõi ai.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFollowingModal} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openFollowersModal}
                onClose={handleCloseFollowersModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Followers List</DialogTitle>
                <DialogContent>
                    {followersList.length > 0 ? (
                        followersList.map((follower) => (
                            <Box
                                key={follower.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    py: 2,
                                    borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
                                    '&:last-child': {
                                        borderBottom: 'none'
                                    },
                                    '&:hover': {
                                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
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
                                        <Typography variant="subtitle1">{follower.fullName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            @{follower.fullName?.split(' ').join('_').toLowerCase()}
                                        </Typography>
                                    </Box>
                                </Box>
                                {auth.id !== follower.id && (
                                    <Button
                                        variant={follower.followers?.some(f => f.id === auth.id) ? "outlined" : "contained"}
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFollowUser(follower.id);
                                        }}
                                        sx={{
                                            borderRadius: 6,
                                            minWidth: '100px'
                                        }}
                                    >
                                        {follower.followers?.some(f => f.id === auth.id) ? "Following" : "Follow"}
                                    </Button>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Chưa có người theo dõi nào.
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFollowersModal} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
}

export default Profile;

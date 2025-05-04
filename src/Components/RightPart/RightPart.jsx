import React, { useEffect, useState } from 'react';
import { Avatar, Button, Paper, Typography, Box, Divider, CircularProgress, Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, getRandomUser } from '../../Store/Auth/Action';
import { useTheme } from '../../theme/ThemeContext';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function RightPart() {
    const user = useSelector(store => store.auth.user);
    const users = useSelector(store => store.auth.users);
    const [change, setChange] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const { isDarkMode } = useTheme();

    const handleFollowUser = (userId) => {
        dispatch(followUser(userId));
        setChange(!change);
    }

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                await dispatch(getRandomUser());
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [dispatch]);

    const SuggestedUserSkeleton = () => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'background.default',
            }}
        >
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width={80} />
            </Box>
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
        </Box>
    );

    return (
        <Paper
            elevation={isDarkMode ? 0 : 3}
            sx={{
                p: 3,
                borderRadius: 3,
                mt: 2,
                backgroundColor: isDarkMode ? 'background.paper' : 'white',
                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
                color: isDarkMode ? 'text.primary' : 'inherit',
                '&:hover': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'inherit',
                    boxShadow: isDarkMode ? '0 0 10px rgba(255, 255, 255, 0.1)' : 'inherit'
                },
                transition: 'all 0.3s ease'
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    flexWrap: 'nowrap',
                    width: '100%'
                }}>
                    <Avatar
                        alt="Profile picture"
                        src={user.image || "https://cdn-icons-png.flaticon.com/512/8345/8345328.png"}
                        sx={{
                            width: 50,
                            height: 50,
                            border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.12)' : 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            flexShrink: 0
                        }}
                    />
                    <Box sx={{
                        flex: '1 1 auto',
                        minWidth: 0, // Để text có thể ellipsis
                        overflow: 'hidden'
                    }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                color: isDarkMode ? 'text.primary' : 'inherit',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            @{user.email?.split('@')[0]}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: isDarkMode ? 'text.secondary' : 'text.secondary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {user.fullName}
                        </Typography>
                    </Box>
                    <Button
                        startIcon={<SwapHorizIcon />}
                        sx={{
                            color: isDarkMode ? 'primary.main' : 'primary.main',
                            minWidth: 100,
                            flexShrink: 0,
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        Chuyển
                    </Button>
                </Box>
            </Box>

            <Divider
                sx={{
                    my: 2,
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'divider'
                }}
            />

            <Box sx={{ mb: 2 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: isDarkMode ? 'text.primary' : 'text.primary',
                            fontWeight: 600
                        }}
                    >
                        Gợi ý cho bạn
                    </Typography>
                    <Button
                        size="small"
                        sx={{
                            color: isDarkMode ? 'primary.main' : 'primary.main',
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        Xem tất cả
                    </Button>
                </Box>

                {isLoading ? (
                    <>
                        <SuggestedUserSkeleton />
                        <SuggestedUserSkeleton />
                        <SuggestedUserSkeleton />
                    </>
                ) : !Array.isArray(users) || users.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 3,
                        color: isDarkMode ? 'text.secondary' : 'text.secondary'
                    }}>
                        <Typography variant="body2">
                            Không có gợi ý nào lúc này
                        </Typography>
                    </Box>
                ) : (
                    users.map((suggestedUser) => (
                        <Box
                            key={suggestedUser.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                mb: 2,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'background.default',
                                '&:hover': {
                                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                    transform: 'translateY(-1px)',
                                    transition: 'all 0.2s ease'
                                }
                            }}
                        >
                            <Avatar
                                src={suggestedUser.image || "https://cdn-icons-png.flaticon.com/512/8345/8345328.png"}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.12)' : 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        color: isDarkMode ? 'text.primary' : 'inherit',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {suggestedUser.fullName}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isDarkMode ? 'text.secondary' : 'text.secondary',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    @{suggestedUser.email?.split('@')[0]}
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleFollowUser(suggestedUser.id)}
                                sx={{
                                    minWidth: 60,
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'primary.main',
                                    color: isDarkMode ? 'text.primary' : 'primary.main',
                                    '&:hover': {
                                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'primary.dark',
                                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <PersonAddIcon sx={{ margin: 'auto' }} />
                            </Button>
                        </Box>
                    ))
                )}
            </Box>
        </Paper>
    );
}

export default RightPart;

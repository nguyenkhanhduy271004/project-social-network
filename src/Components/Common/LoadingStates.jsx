import React from 'react';
import { Box, Skeleton, Paper, CircularProgress, Fade, Typography, Tooltip } from '@mui/material';

// Global loading overlay for full page loading
export const GlobalLoading = ({ message = "Loading..." }) => (
    <Fade in={true}>
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
            }}
        >
            <CircularProgress size={60} sx={{ color: '#1e88e5' }} />
            <Typography variant="h6" sx={{ mt: 2, color: '#1e88e5', fontWeight: 600 }}>
                {message}
            </Typography>
        </Box>
    </Fade>
);

// WebSocket connection status indicator
export const ConnectionStatus = ({ connected, connecting, onClick }) => {
    const getStatusColor = () => {
        if (connecting) return '#FFA000'; // amber
        return connected ? '#4CAF50' : '#F44336'; // green or red
    };

    const getStatusText = () => {
        if (connecting) return 'Connecting...';
        return connected ? 'Connected' : 'Disconnected';
    };

    return (
        <Tooltip title={getStatusText()}>
            <Box
                onClick={onClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: onClick ? 'pointer' : 'default',
                }}
            >
                <Box
                    sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: getStatusColor(),
                        animation: connected
                            ? 'pulse 2s infinite'
                            : connecting
                                ? 'blink 1s infinite'
                                : 'none',
                        '@keyframes pulse': {
                            '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)' },
                            '70%': { boxShadow: '0 0 0 6px rgba(76, 175, 80, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' }
                        },
                        '@keyframes blink': {
                            '0%': { opacity: 0.6 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.6 }
                        }
                    }}
                />
                {onClick && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {getStatusText()}
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );
};

// Improved post skeleton with animation
export const PostSkeleton = () => (
    <Paper
        sx={{
            mb: 2,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                animation: 'shimmer 1.5s infinite',
            },
            '@keyframes shimmer': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' }
            }
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ ml: 2 }}>
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width={80} />
            </Box>
        </Box>
        <Skeleton variant="rectangular" height={200} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width={80} />
            <Skeleton variant="text" width={80} />
            <Skeleton variant="text" width={80} />
        </Box>
    </Paper>
);

export const ProfileSkeleton = () => (
    <Box sx={{ width: '100%', position: 'relative' }}>
        <Skeleton variant="rectangular" width="100%" height={240} />
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Skeleton variant="circular" width={160} height={160} />
                <Box sx={{ flex: 1, ml: 2 }}>
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="text" width={150} />
                </Box>
            </Box>
            <Skeleton variant="text" width={300} />
            <Skeleton variant="text" width={200} />
        </Box>
    </Box>
);

export const ImageGridSkeleton = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton
                key={item}
                variant="rectangular"
                width={128}
                height={128}
                sx={{ borderRadius: 1 }}
            />
        ))}
    </Box>
);

export const CommentSkeleton = () => (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width="70%" />
        </Box>
    </Box>
);

export const NavSkeleton = () => (
    <Box sx={{ p: 2 }}>
        {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                <Skeleton variant="text" width={140} height={36} />
            </Box>
        ))}
    </Box>
);

export const MessageSkeleton = () => (
    <Box sx={{ p: 2 }}>
        {[1, 2, 3].map((item) => (
            <Box
                key={item}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={140} />
                    <Skeleton variant="text" width="60%" />
                </Box>
            </Box>
        ))}
    </Box>
);

export const CardSkeleton = ({ height = 200 }) => (
    <Paper
        sx={{
            p: 2,
            height,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                animation: 'shimmer 1.5s infinite',
            },
            '@keyframes shimmer': {
                '0%': { transform: 'translateX(-100%)' },
                '100%': { transform: 'translateX(100%)' }
            }
        }}
    >
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="50%" />
        <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" height={height - 100} />
        </Box>
    </Paper>
); 
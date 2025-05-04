import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReel, getReels } from "../../Store/Reel/Action";
import {
    Button,
    CircularProgress,
    Modal,
    TextField,
    Box,
    Typography,
    IconButton,
    Fade,
    Paper,
    Container,
    Tooltip,
    LinearProgress,
    Slide
} from "@mui/material";
import {
    ArrowBackIosNew as ArrowBackIosIcon,
    ArrowForwardIos as ArrowForwardIosIcon,
    Add as AddIcon,
    Close as CloseIcon,
    CloudUpload as CloudUploadIcon,
    VolumeOff as VolumeOffIcon,
    VolumeUp as VolumeUpIcon,
    Replay as ReplayIcon
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Reel = () => {
    const dispatch = useDispatch();
    const { reels = [], loading, error } = useSelector((state) => state.reel || {});
    const videoRef = useRef(null);
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [description, setDescription] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoEnded, setIsVideoEnded] = useState(false);

    useEffect(() => {
        dispatch(getReels());
        // Add keyboard event listeners
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowUp') handlePrev();
            if (e.key === 'ArrowDown') handleNext();
            if (e.code === 'Space') {
                e.preventDefault();
                togglePlayPause();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [dispatch]);

    // Reset video state when changing reels
    useEffect(() => {
        setIsVideoEnded(false);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(console.error);
        }
    }, [currentIndex]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current || !touchStartY.current) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchStartX.current - touchEndX;
        const deltaY = touchStartY.current - touchEndY;

        // Check if vertical swipe is more prominent than horizontal
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY > 50) {
                handleNext();
            } else if (deltaY < -50) {
                handlePrev();
            }
        }

        touchStartX.current = null;
        touchStartY.current = null;
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().catch(console.error);
            } else {
                videoRef.current.pause();
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    const handleVideoEnd = () => {
        setIsVideoEnded(true);
        // Optional: Auto-play next reel after current one ends
        // setTimeout(handleNext, 1000);
    };

    const handleReplay = () => {
        if (videoRef.current) {
            setIsVideoEnded(false);
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(console.error);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleCreateReel = async () => {
        if (!file) {
            alert("Vui lòng chọn file!");
            return;
        }

        setIsUploading(true);
        try {
            await dispatch(createReel({ file, description }));
            handleCloseModal();
        } catch (error) {
            console.error('Error creating reel:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFile(null);
        setFilePreview(null);
        setDescription("");
    };

    const handleNext = () => {
        if (currentIndex < (reels?.length || 0) - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const renderMedia = () => {
        const currentReel = reels[currentIndex];
        if (!currentReel?.image) return null;

        const isVideo = currentReel.image.toLowerCase().endsWith(".mp4");

        return (
            <Box
                sx={{
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer'
                }}
                onClick={isVideo ? togglePlayPause : undefined}
            >
                {isVideo ? (
                    <>
                        <video
                            ref={videoRef}
                            src={currentReel.image}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            playsInline
                            autoPlay
                            muted={isMuted}
                            loop={false}
                            onEnded={handleVideoEnd}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                display: 'flex',
                                gap: 1
                            }}
                        >
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMute();
                                }}
                                sx={{
                                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' }
                                }}
                                size="small"
                            >
                                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                            </IconButton>
                        </Box>
                        {isVideoEnded && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <IconButton
                                    onClick={handleReplay}
                                    sx={{
                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                                            transform: 'scale(1.1)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <ReplayIcon sx={{ fontSize: 40 }} />
                                </IconButton>
                            </Box>
                        )}
                    </>
                ) : (
                    <img
                        src={currentReel.image}
                        alt="Reel"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                )}
                {currentReel.description && (
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            color: 'white'
                        }}
                    >
                        <Typography variant="body1">
                            {currentReel.description}
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    };

    if (loading) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default'
                }}
            >
                <CircularProgress size={40} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    p: 4,
                    textAlign: 'center',
                    color: 'error.main'
                }}
            >
                <Typography variant="h6">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Container maxWidth="lg">
                <Tooltip title="Thêm Reel mới" placement="left">
                    <IconButton
                        onClick={() => setIsModalOpen(true)}
                        sx={{
                            position: 'fixed',
                            top: 24,
                            right: 24,
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease-in-out',
                            zIndex: 10,
                            width: 56,
                            height: 56,
                            boxShadow: 3
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>

                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2
                    }}
                >
                    {currentIndex > 0 && (
                        <Fade in={true}>
                            <IconButton
                                onClick={handlePrev}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                    width: 48,
                                    height: 48
                                }}
                            >
                                <ArrowBackIosIcon />
                            </IconButton>
                        </Fade>
                    )}

                    <Paper
                        elevation={8}
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            height: 600,
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {reels?.length > 0 ? (
                            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                                {renderMedia()}
                            </Slide>
                        ) : (
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 4,
                                    textAlign: 'center',
                                    color: 'text.secondary'
                                }}
                            >
                                <CloudUploadIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" gutterBottom>
                                    Chưa có reel nào
                                </Typography>
                                <Typography variant="body2">
                                    Hãy thêm reel đầu tiên của bạn!
                                </Typography>
                            </Box>
                        )}

                        {/* Progress indicators */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                right: 16,
                                display: 'flex',
                                gap: 1
                            }}
                        >
                            {reels.map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        flex: 1,
                                        height: 2,
                                        bgcolor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>

                    {currentIndex < (reels?.length || 0) - 1 && (
                        <Fade in={true}>
                            <IconButton
                                onClick={handleNext}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                                        transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                    width: 48,
                                    height: 48
                                }}
                            >
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Fade>
                    )}
                </Box>
            </Container>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                closeAfterTransition
            >
                <Fade in={isModalOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: 500,
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            boxShadow: 24,
                            p: 4
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" component="h2">
                                Thêm Reel Mới
                            </Typography>
                            <IconButton onClick={handleCloseModal} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                mb: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}
                        >
                            {filePreview ? (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 200,
                                        borderRadius: 2,
                                        overflow: 'hidden'
                                    }}
                                >
                                    {file.type.startsWith('video/') ? (
                                        <video
                                            src={filePreview}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            controls
                                        />
                                    ) : (
                                        <img
                                            src={filePreview}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                    <IconButton
                                        onClick={() => {
                                            setFile(null);
                                            setFilePreview(null);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'rgba(0, 0, 0, 0.8)'
                                            }
                                        }}
                                        size="small"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{
                                        width: '100%',
                                        height: 200,
                                        border: '2px dashed',
                                        borderColor: 'divider',
                                        '&:hover': {
                                            borderColor: 'primary.main'
                                        }
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body1" gutterBottom>
                                            Chọn file ảnh hoặc video
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Kéo thả hoặc click để chọn
                                        </Typography>
                                    </Box>
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="video/*,image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                            )}

                            <TextField
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                        </Box>

                        {isUploading && (
                            <Box sx={{ width: '100%', mb: 2 }}>
                                <LinearProgress />
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                onClick={handleCloseModal}
                                variant="outlined"
                                color="inherit"
                                disabled={isUploading}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleCreateReel}
                                variant="contained"
                                disabled={!file || isUploading}
                                sx={{
                                    position: 'relative',
                                    minWidth: 100
                                }}
                            >
                                {isUploading ? <CircularProgress size={24} /> : 'Thêm'}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default Reel;
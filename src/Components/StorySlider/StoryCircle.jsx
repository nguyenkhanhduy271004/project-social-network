import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import { useDispatch, useSelector } from 'react-redux';
import { createStory, getStories } from '../../Store/Story/Action';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function StoryCircle() {
    const dispatch = useDispatch();
    const stories = useSelector(state => state.story.stories) || [];
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [openImage, setOpenImage] = useState(false);
    const [selectedStories, setSelectedStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        dispatch(getStories());
    }, [dispatch]);

    const groupedStories = stories.reduce((acc, story) => {
        const userId = story.user.id;
        if (!acc[userId]) {
            acc[userId] = { user: story.user, stories: [] };
        }
        acc[userId].stories.push(story);
        return acc;
    }, {});

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setContent('');
        setFile(null);
    };

    const handleSubmit = () => {
        if (!file) {
            setSnackbarMessage("Vui lòng chọn ảnh hoặc video để đăng story!");
            setOpenSnackbar(true);
            return;
        }
        if (!content.trim()) {
            setSnackbarMessage("Vui lòng nhập nội dung story!");
            setOpenSnackbar(true);
            return;
        }

        dispatch(createStory({ file, content }));
        handleClose();
    };

    const handleOpenImage = (stories) => {
        setSelectedStories(stories);
        setCurrentIndex(0);
        setOpenImage(true);
    };

    const handleCloseImage = () => {
        setOpenImage(false);
        setSelectedStories([]);
    };

    return (
        <div>
            <div className='flex items-center rounded-b-md'>
                <div className='flex flex-col items-center mr-4 cursor-pointer' onClick={handleOpen}>
                    <Avatar sx={{ width: "5rem", height: "5rem", bgcolor: "#f0f0f0" }}>
                        <AddIcon sx={{ fontSize: "3rem", color: "#555" }} />
                    </Avatar>
                    <p className='mt-2 text-sm font-medium'>Thêm mới</p>
                </div>

                <div className='flex overflow-x-auto space-x-4'>
                    {Object.values(groupedStories).map((group, index) => (
                        <div
                            key={index}
                            className='flex flex-col items-center cursor-pointer'
                            onClick={() => handleOpenImage(group.stories)}
                        >
                            <Avatar src={group.stories[0].image} alt="story" sx={{ width: "5rem", height: "5rem" }} />
                            <p className='text-xs mt-2 text-center'>{group.user.fullName}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={openImage} onClose={handleCloseImage} maxWidth="sm" fullWidth>
                <DialogContent>
                    {selectedStories.length > 0 && (
                        <Carousel
                            selectedItem={currentIndex}
                            showThumbs={false}
                            showIndicators={true}
                            showStatus={false}
                            infiniteLoop
                            onChange={(index) => setCurrentIndex(index)}
                        >
                            {selectedStories.map((story, index) => (
                                <div key={index} style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {story.image.endsWith('.mp4') || story.image.endsWith('.webm') || story.image.endsWith('.ogg') ? (
                                        <video
                                            src={story.image}
                                            controls
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    ) : (
                                        <img
                                            src={story.image}
                                            alt="story"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                        />
                                    )}
                                    <p style={{
                                        position: 'absolute',
                                        bottom: 10,
                                        left: 0,
                                        right: 0,
                                        textAlign: 'center',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        color: '#fff',
                                        padding: '5px',
                                        borderRadius: '4px'
                                    }}>
                                        {story.content}
                                    </p>
                                </div>
                            ))}
                        </Carousel>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImage} color="secondary">Đóng</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
                    Thêm Story
                </DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            fullWidth
                            label="Nội dung"
                            variant="outlined"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            multiline
                            rows={3}
                            placeholder="Chia sẻ câu chuyện của bạn..."
                        />
                        <Box
                            sx={{
                                border: '2px dashed #1976d2',
                                borderRadius: 2,
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            <label style={{ cursor: 'pointer' }}>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                                    <ImageIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                                    <Typography color="textSecondary">
                                        Kéo thả hoặc click để chọn ảnh/video
                                    </Typography>
                                </Box>
                            </label>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: 2 }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={!file}
                        sx={{ borderRadius: 2 }}
                    >
                        Đăng Story
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
            />
        </div>
    );
}

export default StoryCircle;

import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { createStory, getStories } from '../../Store/Story/Action';

function StoryCircle() {
    const dispatch = useDispatch();
    const stories = useSelector(state => state.story.stories);
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        dispatch(getStories());
    }, [dispatch]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setContent('');
        setFile(null);
    };

    const handleSubmit = () => {
        if (!file) {
            alert("Vui lòng chọn ảnh để đăng story!");
            return;
        }
        if (!content.trim()) {
            alert("Vui lòng nhập nội dung story!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("content", content);

        dispatch(createStory(formData));
        handleClose();
    };

    return (
        <div className=''>
            <div className='flex items-center rounded-b-md'>
                <div className='flex flex-col items-center mr-4 cursor-pointer' onClick={handleOpen}>
                    <Avatar sx={{ width: "5rem", height: "5rem", bgcolor: "#f0f0f0" }}>
                        <AddIcon sx={{ fontSize: "3rem", color: "#555" }} />
                    </Avatar>
                    <p className='mt-2 text-sm font-medium'>Thêm mới</p>
                </div>

                <div className='flex overflow-x-auto space-x-4'>
                    {stories?.map((story, index) => (
                        <div key={index} className='flex flex-col items-center cursor-pointer'>
                            <Avatar src={story.imageUrl} alt={story.user} sx={{ width: "5rem", height: "5rem" }} />
                            <p className='text-xs mt-2 text-center truncate w-16'>{story.user}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm Story</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Nội dung"
                        variant="outlined"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        margin="dense"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ marginTop: '10px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Hủy</Button>
                    <Button onClick={handleSubmit} color="primary" disabled={!file}>Đăng</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default StoryCircle;

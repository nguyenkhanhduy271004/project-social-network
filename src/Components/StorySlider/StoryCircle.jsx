import React from 'react';
import { Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function StoryCircle() {
    const stories = [
        { src: 'https://storage.googleapis.com/a1aa/image/UKLbQFmYa6FAVTXJPEdtyH-hWSIVrkD8AbyS2n8O27w.jpg', alt: 'frieren_1909', name: 'frieren_1909' },
        { src: 'https://storage.googleapis.com/a1aa/image/osdScxsy-joySGh4dXV-iKy5UAe7JeyCBCLDU1Rrhqk.jpg', alt: 'wyn.liin', name: 'wyn.liin' },
        { src: 'https://storage.googleapis.com/a1aa/image/dlbBvNp14AGsfX_Z-L0BLhv1njki2wb9NAi20_Xu0Fk.jpg', alt: '__shinyeeun', name: '__shinyeeun' },
        { src: 'https://storage.googleapis.com/a1aa/image/jLMqJc_G31IsRXmexEtOjaSb3B6xNUWAOCrbAYyKYWU.jpg', alt: 'boibennn', name: 'boibennn' },
        { src: 'https://storage.googleapis.com/a1aa/image/z9O5rmZZWp1mDjtSk7adzzpdtJpN3b7sL7mbiT2JNjs.jpg', alt: 'chanchan.0', name: 'chanchan.0' },
        { src: 'https://storage.googleapis.com/a1aa/image/S7U_kMgYeGbhttj0ogwzRfpZLjk_tw6gG8GEAE0W6lA.jpg', alt: 'dirtycoins.vn', name: 'dirtycoins.vn' },
        { src: 'https://storage.googleapis.com/a1aa/image/ZLB9S-Yq-koP1pe1qxuUhC-Y2Soid-JyIMXhQaQfcEs.jpg', alt: '_bigdaddy', name: '_bigdaddy' },
        { src: 'https://storage.googleapis.com/a1aa/image/ulnaaX_BHJnaGxX_l_W8epjPfV6OnCFZE59ivbri7Mo.jpg', alt: 'roses_are_r', name: 'roses_are_r' },
    ];

    return (
        <div className=''>
            <div className='flex items-center rounded-b-md'>
                <div className='flex flex-col items-center mr-4 cursor-pointer'>
                    <Avatar sx={{ width: "5rem", height: "5rem" }}>
                        <AddIcon sx={{ fontSize: "3rem" }} />
                    </Avatar>
                    <p className='mt-2'>Thêm mới</p>
                </div>
                <div className='flex overflow-x-auto space-x-4'>
                    {stories.map((story, index) => (
                        <div key={index} className='flex flex-col items-center cursor-pointer'>
                            <Avatar src={story.src} alt={story.alt} sx={{ width: "5rem", height: "5rem" }} />
                            <p className='text-xs mt-2'>{story.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StoryCircle;

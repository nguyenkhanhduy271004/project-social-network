import React from 'react';
import Slider from 'react-slick';
import { Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import StoryCircle from './StoryCircle';

const StorySlider = () => {



    return (
        <div className='mt-4'>
            <div className='flex items-center rounded-b-md'>
                <StoryCircle />
            </div>
        </div>
    );
};

export default StorySlider;

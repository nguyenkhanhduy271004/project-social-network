import React from 'react';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AvatarProps extends Omit<MuiAvatarProps, 'size'> {
    size?: 'small' | 'medium' | 'large';
}

const StyledAvatar = styled(MuiAvatar)<AvatarProps>(({ theme, size }) => ({
    ...(size === 'small' && {
        width: theme.spacing(4),
        height: theme.spacing(4),
    }),
    ...(size === 'medium' && {
        width: theme.spacing(6),
        height: theme.spacing(6),
    }),
    ...(size === 'large' && {
        width: theme.spacing(10),
        height: theme.spacing(10),
    }),
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow: theme.shadows[1],
}));

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'medium', ...props }) => {
    return (
        <StyledAvatar
            src={src}
            alt={alt}
            size={size}
            {...props}
        />
    );
};

export default Avatar; 
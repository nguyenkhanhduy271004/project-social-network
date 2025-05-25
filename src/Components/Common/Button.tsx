import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ButtonProps extends MuiButtonProps {
    variant?: 'text' | 'outlined' | 'contained';
    size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled(MuiButton)<ButtonProps>(({ theme, variant, size }) => ({
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 500,
    ...(variant === 'contained' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
    ...(variant === 'outlined' && {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        '&:hover': {
            borderColor: theme.palette.primary.dark,
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
    }),
    ...(size === 'small' && {
        padding: '4px 16px',
        fontSize: '0.875rem',
    }),
    ...(size === 'medium' && {
        padding: '8px 24px',
        fontSize: '1rem',
    }),
    ...(size === 'large' && {
        padding: '12px 32px',
        fontSize: '1.125rem',
    }),
}));

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button; 
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HomeIcon from '@mui/icons-material/Home';

const Container = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    padding: theme.spacing(2),
}));

const Content = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: theme.palette.error.light,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
        '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.4)',
        },
        '70%': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 0 20px rgba(211, 47, 47, 0)',
        },
        '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)',
        },
    },
}));

const StyledIcon = styled(LockOutlinedIcon)(({ theme }) => ({
    fontSize: '50px',
    color: theme.palette.error.main,
}));

const Title = styled(Typography)(({ theme }) => ({
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
}));

const Description = styled(Typography)(({ theme }) => ({
    fontSize: '1.1rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
    lineHeight: 1.6,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    padding: '12px 24px',
    borderRadius: '30px',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
    },
}));

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Content elevation={3}>
                <IconWrapper>
                    <StyledIcon />
                </IconWrapper>
                <Title variant="h1">
                    Access Denied
                </Title>
                <Description>
                    Oops! It seems you don't have permission to access this page.
                    The content you're looking for is restricted or doesn't exist.
                </Description>
                <StyledButton
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </StyledButton>
            </Content>
        </Container>
    );
};

export default Forbidden; 
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Avatar from '../common/Avatar';
import { ROUTES } from '../../config/routes';
import { RootState } from '../../types';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    showAvatar?: boolean;
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Header: React.FC<HeaderProps> = ({ title, showBack = false, showAvatar = true }) => {
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleBack = () => {
        navigate(-1);
    };

    const handleProfileClick = () => {
        navigate(ROUTES.ACCOUNT);
    };

    return (
        <StyledAppBar position="sticky">
            <Toolbar>
                {showBack && (
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleBack}
                        sx={{ mr: 2 }}
                    >
                        <KeyboardBackspaceIcon />
                    </IconButton>
                )}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                {showAvatar && user && (
                    <Box onClick={handleProfileClick} sx={{ cursor: 'pointer' }}>
                        <Avatar
                            src={user.image}
                            alt={user.fullName}
                            size="small"
                        />
                    </Box>
                )}
            </Toolbar>
        </StyledAppBar>
    );
};

export default Header; 
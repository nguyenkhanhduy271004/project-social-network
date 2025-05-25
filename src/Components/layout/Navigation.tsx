import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import { ROUTES } from '../../config/routes';

const StyledPaper = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const Navigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        navigate(newValue);
    };

    return (
        <StyledPaper elevation={3}>
            <BottomNavigation
                value={location.pathname}
                onChange={handleChange}
                showLabels
            >
                <BottomNavigationAction
                    label="Home"
                    value={ROUTES.HOME}
                    icon={<HomeIcon />}
                />
                <BottomNavigationAction
                    label="Search"
                    value={ROUTES.SEARCH}
                    icon={<SearchIcon />}
                />
                <BottomNavigationAction
                    label="Notifications"
                    value={ROUTES.NOTIFICATIONS}
                    icon={<NotificationsIcon />}
                />
                <BottomNavigationAction
                    label="Messages"
                    value={ROUTES.MESSAGE}
                    icon={<MessageIcon />}
                />
            </BottomNavigation>
        </StyledPaper>
    );
};

export default Navigation; 
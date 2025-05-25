import React from 'react';
import { Avatar, Box, Typography, Paper } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

const MessageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '0.75rem',
    '&.user-message': {
        flexDirection: 'row-reverse',
    },
}));

const MessageBubble = styled(Paper)(({ theme, isAI }) => ({
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: '1rem',
    backgroundColor: isAI ? theme.palette.primary.light : theme.palette.grey[100],
    color: isAI ? theme.palette.primary.contrastText : theme.palette.text.primary,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    '&.user-message': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
}));

const TimeStamp = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: '0.25rem',
    textAlign: 'right',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 36,
    height: 36,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}));

const ChatMessage = ({ message, isAI }) => {
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <MessageContainer className={!isAI ? 'user-message' : ''}>
            <StyledAvatar>
                {isAI ? <SmartToyIcon /> : <PersonIcon />}
            </StyledAvatar>
            <Box>
                <MessageBubble
                    elevation={1}
                    isAI={isAI}
                    className={!isAI ? 'user-message' : ''}
                >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                    </Typography>
                </MessageBubble>
                <TimeStamp>
                    {formatTime(message.timestamp)}
                </TimeStamp>
            </Box>
        </MessageContainer>
    );
};

export default ChatMessage; 
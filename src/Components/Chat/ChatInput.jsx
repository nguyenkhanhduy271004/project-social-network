import React, { useState } from 'react';
import { TextField, IconButton, Paper, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';

const InputContainer = styled(Paper)(({ theme }) => ({
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0.75rem',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    flex: 1,
    '& .MuiOutlinedInput-root': {
        borderRadius: '1.25rem',
        backgroundColor: theme.palette.background.default,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
        },
    },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '0.75rem',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'scale(1.05)',
    },
    '&:disabled': {
        backgroundColor: theme.palette.action.disabled,
        color: theme.palette.action.disabledBackground,
    },
}));

const ChatInput = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputContainer elevation={2}>
                <StyledTextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    variant="outlined"
                    disabled={disabled}
                    fullWidth
                    multiline
                    maxRows={4}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent',
                        },
                    }}
                />
                <SendButton
                    type="submit"
                    disabled={!message.trim() || disabled}
                    size="large"
                >
                    <SendIcon />
                </SendButton>
            </InputContainer>
        </form>
    );
};

export default ChatInput; 
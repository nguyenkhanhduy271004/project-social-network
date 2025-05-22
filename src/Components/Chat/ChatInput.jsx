import React, { useState } from 'react';
import { TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';

const InputContainer = styled(Paper)(({ theme }) => ({
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    flex: 1,
    '& .MuiOutlinedInput-root': {
        borderRadius: '1.5rem',
        backgroundColor: theme.palette.background.default,
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
            <InputContainer>
                <StyledTextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    variant="outlined"
                    disabled={disabled}
                    fullWidth
                    multiline
                    maxRows={4}
                />
                <IconButton
                    color="primary"
                    type="submit"
                    disabled={!message.trim() || disabled}
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    }}
                >
                    <SendIcon />
                </IconButton>
            </InputContainer>
        </form>
    );
};

export default ChatInput; 
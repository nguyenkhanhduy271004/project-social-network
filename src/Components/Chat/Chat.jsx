import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendMessage } from '../../services/chatService';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const ChatContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    backgroundColor: theme.palette.background.default,
}));

const Header = styled(Paper)(({ theme }) => ({
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    overflowY: 'auto',
    padding: '2rem',
    backgroundColor: theme.palette.background.default,
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.background.paper,
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.light,
        borderRadius: '3px',
    },
}));

const LoadingContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    marginBottom: '1rem',
});

const InputWrapper = styled(Box)(({ theme }) => ({
    padding: '1rem 2rem',
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (content) => {
        const userMessage = {
            content,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await sendMessage(content, 'deepseek');
            const aiResponse = {
                content: response.response,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setError('Failed to get response from AI. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ChatContainer>
            <Header elevation={3}>
                <SmartToyIcon sx={{ fontSize: 32 }} />
                <Typography variant="h6">
                    Chat With AI
                </Typography>
            </Header>

            {error && (
                <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                </Alert>
            )}

            <MessagesContainer>
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        isAI={index % 2 === 1}
                    />
                ))}
                {isLoading && (
                    <LoadingContainer>
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="text.secondary">
                            AI is thinking...
                        </Typography>
                    </LoadingContainer>
                )}
                <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputWrapper>
                <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </InputWrapper>
        </ChatContainer>
    );
};

export default Chat; 
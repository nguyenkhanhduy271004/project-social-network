import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, ToggleButton, ToggleButtonGroup, Switch, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendMessage, sendStreamMessage } from '../../services/chatService';

const ChatContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '1rem',
    backgroundColor: theme.palette.background.default,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    marginBottom: '1rem',
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

const ModelSelector = styled(ToggleButtonGroup)(({ theme }) => ({
    marginBottom: '1rem',
    '& .MuiToggleButton-root': {
        textTransform: 'none',
        padding: '0.5rem 1rem',
    },
}));

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [model, setModel] = useState('gemini');
    const [useStreaming, setUseStreaming] = useState(false);
    const [currentStreamMessage, setCurrentStreamMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentStreamMessage]);

    const handleModelChange = (event, newModel) => {
        if (newModel !== null) {
            setModel(newModel);
            setMessages([]);
            setError(null);
            setCurrentStreamMessage('');
            // Only enable streaming for Deepseek
            setUseStreaming(newModel === 'deepseek');
        }
    };

    const handleStreamingChange = (event) => {
        setUseStreaming(event.target.checked);
    };

    const handleSendMessage = async (content) => {
        const userMessage = {
            content,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);
        setCurrentStreamMessage('');

        try {
            if (model === 'deepseek' && useStreaming) {
                // Handle streaming response
                const aiMessage = {
                    content: '',
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, aiMessage]);

                await sendStreamMessage(content, (chunk) => {
                    setCurrentStreamMessage((prev) => prev + chunk);
                });

                // Update the final message with the complete response
                setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        ...aiMessage,
                        content: currentStreamMessage,
                    };
                    return newMessages;
                });
                setCurrentStreamMessage('');
            } else {
                // Handle regular response
                const response = await sendMessage(content, model);
                const aiResponse = {
                    content: response.response,
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, aiResponse]);
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            setError('Failed to get response from AI. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ChatContainer>
            <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
                Chat with AI
            </Typography>

            <ModelSelector
                value={model}
                exclusive
                onChange={handleModelChange}
                aria-label="AI model selection"
            >
                <ToggleButton value="gemini" aria-label="Gemini">
                    Gemini
                </ToggleButton>
                <ToggleButton value="openai" aria-label="OpenAI">
                    OpenAI
                </ToggleButton>
                <ToggleButton value="deepseek" aria-label="Deepseek">
                    Deepseek
                </ToggleButton>
            </ModelSelector>

            {model === 'deepseek' && (
                <FormControlLabel
                    control={
                        <Switch
                            checked={useStreaming}
                            onChange={handleStreamingChange}
                            color="primary"
                        />
                    }
                    label="Use Streaming"
                    sx={{ mb: 2 }}
                />
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
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
                {currentStreamMessage && (
                    <ChatMessage
                        message={{
                            content: currentStreamMessage,
                            timestamp: new Date().toISOString(),
                        }}
                        isAI={true}
                    />
                )}
                {isLoading && !currentStreamMessage && (
                    <LoadingContainer>
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="text.secondary">
                            AI is typing...
                        </Typography>
                    </LoadingContainer>
                )}
                <div ref={messagesEndRef} />
            </MessagesContainer>

            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </ChatContainer>
    );
};

export default Chat; 
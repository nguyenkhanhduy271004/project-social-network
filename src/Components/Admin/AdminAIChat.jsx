import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../config/api';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Alert,
    IconButton,
    Tooltip,
    Avatar,
    useTheme,
    Container,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    height: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    margin: theme.spacing(2),
}));

const ChatHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ChatMessages = styled(Box)(({ theme }) => ({
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.grey[100],
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.grey[400],
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.grey[500],
    },
}));

const ChatInput = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
    padding: theme.spacing(2),
    maxWidth: '70%',
    backgroundColor: isUser ? theme.palette.primary.light : theme.palette.background.paper,
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],
    position: 'relative',
    '&:hover .message-actions': {
        opacity: 1,
    },
}));

const MessageActions = styled(Box)(({ theme }) => ({
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    gap: theme.spacing(1),
}));

const AdminAIChat = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const messagesEndRef = useRef(null);
    const theme = useTheme();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/api/ai/query`, {
                params: { query: query.trim() }
            });

            setChatHistory(prev => [
                ...prev,
                { type: 'user', content: query },
                { type: 'ai', content: response.data }
            ]);
            setQuery('');
        } catch (err) {
            setError(err.response?.data || 'An error occurred while processing your query');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyMessage = (content) => {
        const textToCopy = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
        navigator.clipboard.writeText(textToCopy);
    };

    const handleClearChat = () => {
        setChatHistory([]);
    };

    const formatMessage = (content) => {
        if (typeof content === 'object') {
            return (
                <Box sx={{
                    backgroundColor: theme.palette.grey[100],
                    p: 1,
                    borderRadius: 1,
                    overflowX: 'auto'
                }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(content, null, 2)}
                    </pre>
                </Box>
            );
        }
        return content;
    };

    return (
        <Box sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.default,
        }}>
            <StyledPaper elevation={3}>
                <ChatHeader>
                    <SmartToyIcon sx={{ fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        AI Database Assistant
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Tooltip title="Clear chat">
                        <IconButton
                            onClick={handleClearChat}
                            sx={{
                                color: 'inherit',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </ChatHeader>

                <ChatMessages>
                    <List>
                        {chatHistory.map((message, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 2,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    {message.type === 'ai' && (
                                        <Avatar sx={{
                                            bgcolor: theme.palette.primary.main,
                                            width: 36,
                                            height: 36
                                        }}>
                                            <SmartToyIcon />
                                        </Avatar>
                                    )}
                                    <MessageBubble isUser={message.type === 'user'}>
                                        <MessageActions className="message-actions">
                                            <Tooltip title="Copy message">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleCopyMessage(message.content)}
                                                    sx={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                        }
                                                    }}
                                                >
                                                    <ContentCopyIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </MessageActions>
                                        <Typography variant="body1">
                                            {formatMessage(message.content)}
                                        </Typography>
                                    </MessageBubble>
                                    {message.type === 'user' && (
                                        <Avatar sx={{
                                            bgcolor: theme.palette.secondary.main,
                                            width: 36,
                                            height: 36
                                        }}>
                                            <PersonIcon />
                                        </Avatar>
                                    )}
                                </Box>
                            </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>
                </ChatMessages>

                <ChatInput>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-end'
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Ask a question about the database..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={loading}
                            multiline
                            maxRows={4}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: theme.palette.background.paper,
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !query.trim()}
                            sx={{
                                minWidth: 100,
                                height: 48,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <>
                                    Send
                                    <SendIcon sx={{ ml: 1 }} />
                                </>
                            )}
                        </Button>
                    </Box>
                </ChatInput>
            </StyledPaper>
        </Box>
    );
};

export default AdminAIChat; 
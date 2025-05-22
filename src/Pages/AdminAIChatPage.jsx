import React, { useState, useRef, useEffect } from 'react';
import { api } from '../config/api';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    CircularProgress,
    List,
    ListItem,
    Alert,
    IconButton,
    Tooltip,
    Avatar,
    useTheme,
    AppBar,
    Toolbar,
    Container,
    Divider,
    Fade,
    Zoom,
    Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden',
    position: 'relative',
}));

const ChatMessages = styled(Box)(({ theme }) => ({
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.grey[50],
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.grey[100],
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.grey[400],
        borderRadius: '4px',
        '&:hover': {
            background: theme.palette.grey[500],
        },
    },
}));

const ChatInput = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}33, ${theme.palette.secondary.main}33)`,
    },
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
    padding: theme.spacing(2),
    maxWidth: '70%',
    backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
    color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[2],
    position: 'relative',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        '& .message-actions': {
            opacity: 1,
        },
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(0.5),
}));

const WelcomeMessage = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],
    maxWidth: 600,
    margin: '0 auto',
    marginTop: theme.spacing(4),
}));

const AdminAIChatPage = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const messagesEndRef = useRef(null);
    const theme = useTheme();
    const navigate = useNavigate();

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
                    p: 2,
                    borderRadius: 1,
                    overflowX: 'auto',
                    '& pre': {
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                    }
                }}>
                    <pre>{JSON.stringify(content, null, 2)}</pre>
                </Box>
            );
        }
        return content;
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
            <AppBar
                position="static"
                color="primary"
                elevation={0}
                sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
            >
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate(-1)}
                        sx={{
                            mr: 2,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <SmartToyIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        AI Database Assistant
                    </Typography>
                    <Tooltip title="Clear chat">
                        <IconButton
                            onClick={handleClearChat}
                            color="inherit"
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <StyledPaper elevation={0}>
                <ChatMessages>
                    {chatHistory.length === 0 ? (
                        <Fade in={true} timeout={1000}>
                            <WelcomeMessage>
                                <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Welcome to AI Database Assistant
                                </Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    Ask me anything about your database. I can help you with:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 2 }}>
                                    {['Query data', 'Analyze trends', 'Get statistics', 'Find relationships'].map((item) => (
                                        <Chip
                                            key={item}
                                            label={item}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                        />
                                    ))}
                                </Box>
                            </WelcomeMessage>
                        </Fade>
                    ) : (
                        <List>
                            {chatHistory.map((message, index) => (
                                <Zoom in={true} key={index}>
                                    <ListItem
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
                                                    height: 36,
                                                    boxShadow: theme.shadows[2],
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
                                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
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
                                                    height: 36,
                                                    boxShadow: theme.shadows[2],
                                                }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            )}
                                        </Box>
                                    </ListItem>
                                </Zoom>
                            ))}
                            <div ref={messagesEndRef} />
                        </List>
                    )}
                </ChatMessages>

                <ChatInput>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                '& .MuiAlert-icon': {
                                    alignItems: 'center',
                                }
                            }}
                        >
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
                                    boxShadow: theme.shadows[1],
                                    '&:hover': {
                                        boxShadow: theme.shadows[2],
                                    },
                                    '&.Mui-focused': {
                                        boxShadow: theme.shadows[3],
                                    },
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !query.trim()}
                            sx={{
                                minWidth: 120,
                                height: 48,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                boxShadow: theme.shadows[2],
                                '&:hover': {
                                    boxShadow: theme.shadows[4],
                                }
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

export default AdminAIChatPage; 
import React from 'react';
import { Avatar } from '@mui/material';

const ChatMessage = ({ message, isAI }) => {
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const messageContainerStyle = {
        display: 'flex',
        flexDirection: isAI ? 'row' : 'row-reverse',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        gap: '0.5rem',
    };

    const messageBubbleStyle = {
        maxWidth: '70%',
        padding: '0.75rem 1rem',
        borderRadius: '1rem',
        backgroundColor: isAI ? '#e3f2fd' : '#f5f5f5',
        color: isAI ? '#1976d2' : '#000000',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    };

    const messageTimeStyle = {
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.25rem',
        display: 'block',
    };

    return (
        <div style={messageContainerStyle}>
            <Avatar
                src={isAI ? '/ai-avatar.png' : undefined}
                style={{ width: 32, height: 32 }}
            >
                {isAI ? 'AI' : 'U'}
            </Avatar>
            <div>
                <div style={messageBubbleStyle}>
                    {message.content}
                </div>
                <span style={messageTimeStyle}>
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
};

export default ChatMessage; 
import { createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../../services/chat';
import { Conversation, Message } from '../../types';

export const getConversations = createAsyncThunk(
    'chat/getConversations',
    async () => {
        const response = await chatService.getConversations();
        return response;
    }
);

export const getMessages = createAsyncThunk(
    'chat/getMessages',
    async (conversationId: string) => {
        const response = await chatService.getMessages(conversationId);
        return response;
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ conversationId, content }: { conversationId: string; content: string }) => {
        const response = await chatService.sendMessage(conversationId, content);
        return response;
    }
);

export const createConversation = createAsyncThunk(
    'chat/createConversation',
    async (userId: string) => {
        const response = await chatService.createConversation(userId);
        return response;
    }
);

export const deleteConversation = createAsyncThunk(
    'chat/deleteConversation',
    async (conversationId: string) => {
        const response = await chatService.deleteConversation(conversationId);
        return response;
    }
); 
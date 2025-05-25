import { API_BASE_URL, API_PREFIX, API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const api = axios.create({
    baseURL: `${API_BASE_URL}${API_PREFIX}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const chatService = {
    getConversations: async () => {
        const response = await api.get(API_ENDPOINTS.CHAT.GET_CONVERSATIONS);
        return response.data;
    },

    getMessages: async (conversationId) => {
        const response = await api.get(`${API_ENDPOINTS.CHAT.GET_MESSAGES}/${conversationId}`);
        return response.data;
    },

    sendMessage: async (conversationId, content) => {
        const response = await api.post(API_ENDPOINTS.CHAT.SEND_MESSAGE, {
            conversationId,
            content,
        });
        return response.data;
    },

    createConversation: async (userId) => {
        const response = await api.post('/chat/conversation', { userId });
        return response.data;
    },

    deleteConversation: async (conversationId) => {
        const response = await api.delete(`/chat/conversation/${conversationId}`);
        return response.data;
    },
}; 
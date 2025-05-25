import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
export const API_PREFIX = '/api/v1';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user',
    },
    POST: {
        CREATE: '/post',
        GET_ALL: '/post',
        GET_BY_ID: '/post',
        LIKE: '/post/like',
        COMMENT: '/post/comment',
    },
    USER: {
        PROFILE: '/user/profile',
        FOLLOW: '/user/follow',
        UNFOLLOW: '/user/unfollow',
        SEARCH: '/user/search',
    },
    CHAT: {
        GET_CONVERSATIONS: '/chat/conversations',
        GET_MESSAGES: '/chat/messages',
        SEND_MESSAGE: '/chat/message',
    },
};

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("jwt");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export const webSocketConfig = {
    debug: process.env.NODE_ENV !== 'production',
    reconnectDelay: 5000,
    reconnectDelayMax: 30000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    connectTimeout: 10000,
    connectHeaders: {
        "Origin": window.location.origin
    }
};

export const getWebSocketUrl = () => {
    if (API_BASE_URL.startsWith(window.location.origin) || API_BASE_URL === 'http://localhost:8080') {
        return `${API_BASE_URL}/ws`;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const baseUrl = API_BASE_URL.replace(/^https?:/, wsProtocol);
    return `${baseUrl}/ws`;
};

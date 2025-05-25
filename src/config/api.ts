import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

export const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
export const API_PREFIX: string = '/api/v1';

interface ApiEndpoints {
    AUTH: {
        LOGIN: string;
        REGISTER: string;
        PROFILE: string;
        UPDATE_PROFILE: string;
    };
    POST: {
        CREATE: string;
        GET_ALL: string;
        GET_BY_ID: string;
        LIKE: string;
        COMMENT: string;
    };
    USER: {
        PROFILE: string;
        FOLLOW: string;
        UNFOLLOW: string;
        SEARCH: string;
    };
    CHAT: {
        GET_CONVERSATIONS: string;
        GET_MESSAGES: string;
        SEND_MESSAGE: string;
    };
}

export const API_ENDPOINTS: ApiEndpoints = {
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
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("jwt");
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

interface WebSocketConfig {
    debug: boolean;
    reconnectDelay: number;
    reconnectDelayMax: number;
    heartbeatIncoming: number;
    heartbeatOutgoing: number;
    connectTimeout: number;
    connectHeaders: {
        Origin: string;
    };
}

export const webSocketConfig: WebSocketConfig = {
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

export const getWebSocketUrl = (): string => {
    if (API_BASE_URL.startsWith(window.location.origin) || API_BASE_URL === 'http://localhost:8080') {
        return `${API_BASE_URL}/ws`;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const baseUrl = API_BASE_URL.replace(/^https?:/, wsProtocol);
    return `${baseUrl}/ws`;
}; 
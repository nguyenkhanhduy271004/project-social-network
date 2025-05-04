import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

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

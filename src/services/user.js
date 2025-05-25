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

export const userService = {
    getUserProfile: async (userId) => {
        const response = await api.get(`${API_ENDPOINTS.USER.PROFILE}/${userId}`);
        return response.data;
    },

    followUser: async (userId) => {
        const response = await api.post(`${API_ENDPOINTS.USER.FOLLOW}/${userId}`);
        return response.data;
    },

    unfollowUser: async (userId) => {
        const response = await api.delete(`${API_ENDPOINTS.USER.UNFOLLOW}/${userId}`);
        return response.data;
    },

    searchUsers: async (query) => {
        const response = await api.get(`${API_ENDPOINTS.USER.SEARCH}?q=${query}`);
        return response.data;
    },

    getFollowers: async (userId) => {
        const response = await api.get(`${API_ENDPOINTS.USER.PROFILE}/${userId}/followers`);
        return response.data;
    },

    getFollowing: async (userId) => {
        const response = await api.get(`${API_ENDPOINTS.USER.PROFILE}/${userId}/following`);
        return response.data;
    },
}; 
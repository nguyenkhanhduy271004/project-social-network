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

export const authService = {
    login: async (credentials) => {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        if (response.data.token) {
            localStorage.setItem('jwt', response.data.token);
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        if (response.data.token) {
            localStorage.setItem('jwt', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('jwt');
    },

    getProfile: async () => {
        const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        return response.data;
    },

    updateProfile: async (formData) => {
        const response = await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
}; 
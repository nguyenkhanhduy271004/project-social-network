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

export const postService = {
    createPost: async (postData) => {
        const response = await api.post(API_ENDPOINTS.POST.CREATE, postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAllPosts: async () => {
        const response = await api.get(API_ENDPOINTS.POST.GET_ALL);
        return response.data;
    },

    getPostById: async (postId) => {
        const response = await api.get(`${API_ENDPOINTS.POST.GET_BY_ID}/${postId}`);
        return response.data;
    },

    likePost: async (postId) => {
        const response = await api.post(`${API_ENDPOINTS.POST.LIKE}/${postId}`);
        return response.data;
    },

    commentOnPost: async (postId, comment) => {
        const response = await api.post(`${API_ENDPOINTS.POST.COMMENT}/${postId}`, { comment });
        return response.data;
    },

    deletePost: async (postId) => {
        const response = await api.delete(`${API_ENDPOINTS.POST.GET_BY_ID}/${postId}`);
        return response.data;
    },
}; 
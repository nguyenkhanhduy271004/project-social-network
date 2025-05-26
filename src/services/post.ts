import api from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { Post } from '../types';

class PostService {
    async createPost(postData: FormData) {
        const response = await api.post(API_ENDPOINTS.POST.CREATE, postData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async getAllPosts() {
        const response = await api.get(API_ENDPOINTS.POST.GET_ALL);
        return response.data;
    }

    async getUsersPost(userId: string) {
        const response = await api.get(`${API_ENDPOINTS.POST.GET_ALL}/user/${userId}`);
        return response.data;
    }

    async getRepost() {
        const response = await api.get(`${API_ENDPOINTS.POST.GET_ALL}/repost`);
        return response.data;
    }

    async getPostById(postId: string) {
        const response = await api.get(`${API_ENDPOINTS.POST.GET_BY_ID}/${postId}`);
        return response.data;
    }

    async likePost(postId: string) {
        const response = await api.post(`${API_ENDPOINTS.POST.LIKE}/${postId}`);
        return response.data;
    }

    async unlikePost(postId: string) {
        const response = await api.delete(`${API_ENDPOINTS.POST.LIKE}/${postId}`);
        return response.data;
    }

    async commentOnPost(postId: string, comment: string) {
        const response = await api.post(`${API_ENDPOINTS.POST.COMMENT}/${postId}`, { comment });
        return response.data;
    }

    async deletePost(postId: string) {
        const response = await api.delete(`${API_ENDPOINTS.POST.GET_BY_ID}/${postId}`);
        return response.data;
    }
}

export const postService = new PostService(); 
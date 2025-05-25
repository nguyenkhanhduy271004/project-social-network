import { api } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { User } from '../types';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

class AuthService {
    async login(credentials: LoginCredentials) {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        if (response.data.token) {
            localStorage.setItem('jwt', response.data.token);
        }
        return response.data;
    }

    async register(userData: RegisterData) {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        if (response.data.token) {
            localStorage.setItem('jwt', response.data.token);
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem('jwt');
    }

    async getProfile() {
        const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        return response.data;
    }

    async updateProfile(formData: FormData) {
        const response = await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async followUser(userId: string) {
        const response = await api.post(`${API_ENDPOINTS.USER.FOLLOW}/${userId}`);
        return response.data;
    }

    async unfollowUser(userId: string) {
        const response = await api.post(`${API_ENDPOINTS.USER.UNFOLLOW}/${userId}`);
        return response.data;
    }
}

export const authService = new AuthService(); 
import api from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types';

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
        if (response.data.token) {
            localStorage.setItem('jwt', response.data.token);
        }
        return response.data;
    }

    async register(userData: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
        if (response.data.token) {
            localStorage.setItem('jwt', response.data.token);
        }
        return response.data;
    }

    logout(): void {
        localStorage.removeItem('jwt');
    }

    getToken(): string | null {
        return localStorage.getItem('jwt');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    async getProfile(): Promise<User> {
        const response = await api.get<User>(API_ENDPOINTS.AUTH.PROFILE);
        return response.data;
    }

    async updateProfile(formData: FormData): Promise<User> {
        const response = await api.put<User>(API_ENDPOINTS.AUTH.PROFILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async followUser(userId: string): Promise<{ following: User[] }> {
        const response = await api.post<{ following: User[] }>(`${API_ENDPOINTS.USER.FOLLOW}/${userId}`);
        return response.data;
    }

    async unfollowUser(userId: string): Promise<{ following: User[] }> {
        const response = await api.post<{ following: User[] }>(`${API_ENDPOINTS.USER.UNFOLLOW}/${userId}`);
        return response.data;
    }
}

export const authService = new AuthService(); 
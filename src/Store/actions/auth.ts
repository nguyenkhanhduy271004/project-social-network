import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth';
import { User } from '../../types';

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }) => {
        const response = await authService.login(credentials);
        return response;
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: { email: string; password: string; fullName: string }) => {
        const response = await authService.register(userData);
        return response;
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        await authService.logout();
    }
);

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async () => {
        const response = await authService.getProfile();
        return response;
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (formData: FormData) => {
        const response = await authService.updateProfile(formData);
        return response;
    }
);

export const followUser = createAsyncThunk(
    'auth/followUser',
    async (userId: string) => {
        const response = await authService.followUser(userId);
        return response;
    }
);

export const unfollowUser = createAsyncThunk(
    'auth/unfollowUser',
    async (userId: string) => {
        const response = await authService.unfollowUser(userId);
        return response;
    }
); 
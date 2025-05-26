import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth';
import { User, AuthResponse } from '../../types';

export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string }>(
    'auth/login',
    async (credentials) => {
        const response = await authService.login(credentials);
        return response;
    }
);

export const registerUser = createAsyncThunk<AuthResponse, { email: string; password: string; fullName: string }>(
    'auth/register',
    async (userData) => {
        const response = await authService.register(userData);
        return response;
    }
);

export const logoutUser = createAsyncThunk<void, void>(
    'auth/logout',
    async () => {
        await authService.logout();
    }
);

export const getProfile = createAsyncThunk<User, void>(
    'auth/getProfile',
    async () => {
        const response = await authService.getProfile();
        return response;
    }
);

export const updateUserProfile = createAsyncThunk<User, FormData>(
    'auth/updateProfile',
    async (formData) => {
        const response = await authService.updateProfile(formData);
        return response;
    }
);

export const followUser = createAsyncThunk<{ following: User[] }, string>(
    'auth/followUser',
    async (userId) => {
        const response = await authService.followUser(userId);
        return response;
    }
);

export const unfollowUser = createAsyncThunk<{ following: User[] }, string>(
    'auth/unfollowUser',
    async (userId) => {
        const response = await authService.unfollowUser(userId);
        return response;
    }
); 
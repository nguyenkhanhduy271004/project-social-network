import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/user';
import { User } from '../../types';

export const getUserProfile = createAsyncThunk(
    'user/getProfile',
    async (userId: string) => {
        const response = await userService.getUserProfile(userId);
        return response;
    }
);

export const followUser = createAsyncThunk(
    'user/follow',
    async (userId: string) => {
        const response = await userService.followUser(userId);
        return response;
    }
);

export const unfollowUser = createAsyncThunk(
    'user/unfollow',
    async (userId: string) => {
        const response = await userService.unfollowUser(userId);
        return response;
    }
);

export const searchUsers = createAsyncThunk(
    'user/search',
    async (query: string) => {
        const response = await userService.searchUsers(query);
        return response;
    }
);

export const getFollowers = createAsyncThunk(
    'user/getFollowers',
    async (userId: string) => {
        const response = await userService.getFollowers(userId);
        return response;
    }
);

export const getFollowing = createAsyncThunk(
    'user/getFollowing',
    async (userId: string) => {
        const response = await userService.getFollowing(userId);
        return response;
    }
); 
import { createAsyncThunk } from '@reduxjs/toolkit';
import { postService } from '../../services/post';
import { Post } from '../../types';

export const createPost = createAsyncThunk(
    'post/create',
    async (postData: FormData) => {
        const response = await postService.createPost(postData);
        return response;
    }
);

export const getPosts = createAsyncThunk(
    'post/getAll',
    async () => {
        const response = await postService.getAllPosts();
        return response;
    }
);

export const getUsersPost = createAsyncThunk(
    'post/getUsersPost',
    async (userId: string) => {
        const response = await postService.getUsersPost(userId);
        return response;
    }
);

export const getRepost = createAsyncThunk(
    'post/getRepost',
    async () => {
        const response = await postService.getRepost();
        return response;
    }
);

export const getPost = createAsyncThunk(
    'post/getById',
    async (postId: string) => {
        const response = await postService.getPostById(postId);
        return response;
    }
);

export const likePost = createAsyncThunk(
    'post/like',
    async (postId: string) => {
        const response = await postService.likePost(postId);
        return response;
    }
);

export const unlikePost = createAsyncThunk(
    'post/unlike',
    async (postId: string) => {
        const response = await postService.unlikePost(postId);
        return response;
    }
);

export const commentOnPost = createAsyncThunk(
    'post/comment',
    async ({ postId, comment }: { postId: string; comment: string }) => {
        const response = await postService.commentOnPost(postId, comment);
        return response;
    }
);

export const deletePost = createAsyncThunk(
    'post/delete',
    async (postId: string) => {
        const response = await postService.deletePost(postId);
        return response;
    }
); 
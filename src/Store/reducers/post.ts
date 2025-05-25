import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostState, Post } from '../../types';
import {
    getPosts,
    createPost,
    likePost,
    unlikePost,
    deletePost,
    getPost,
    getRepost,
    getUsersPost,
} from '../actions/post';

const initialState: PostState = {
    posts: [],
    currentPost: null,
    rePost: [],
    loading: false,
    error: null,
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentPost: (state) => {
            state.currentPost = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Posts
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to get posts';
            })
            // Get User's Posts
            .addCase(getUsersPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersPost.fulfilled, (state, action: PayloadAction<Post[]>) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(getUsersPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to get user posts';
            })
            // Get Reposts
            .addCase(getRepost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRepost.fulfilled, (state, action: PayloadAction<Post[]>) => {
                state.loading = false;
                state.rePost = action.payload;
            })
            .addCase(getRepost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to get reposts';
            })
            // Create Post
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
                state.loading = false;
                state.posts.unshift(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create post';
            })
            // Like Post
            .addCase(likePost.fulfilled, (state, action: PayloadAction<Post>) => {
                const index = state.posts.findIndex((post) => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
                if (state.currentPost?.id === action.payload.id) {
                    state.currentPost = action.payload;
                }
            })
            // Unlike Post
            .addCase(unlikePost.fulfilled, (state, action: PayloadAction<Post>) => {
                const index = state.posts.findIndex((post) => post.id === action.payload.id);
                if (index !== -1) {
                    state.posts[index] = action.payload;
                }
                if (state.currentPost?.id === action.payload.id) {
                    state.currentPost = action.payload;
                }
            })
            // Delete Post
            .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
                state.posts = state.posts.filter((post) => post.id !== action.payload);
                if (state.currentPost?.id === action.payload) {
                    state.currentPost = null;
                }
            })
            // Get Post
            .addCase(getPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPost.fulfilled, (state, action: PayloadAction<Post>) => {
                state.loading = false;
                state.currentPost = action.payload;
            })
            .addCase(getPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to get post';
            });
    },
});

export const { clearError, clearCurrentPost } = postSlice.actions;
export default postSlice.reducer; 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '../../types';
import { getPosts, getUsersPost, getRepost, createPost, likePost, unlikePost, deletePost, getPost } from '../actions/post';

interface PostState {
    posts: Post[];
    rePost: Post[];
    currentPost: Post | null;
    loading: boolean;
    error: string | null;
}

const initialState: PostState = {
    posts: [],
    rePost: [],
    currentPost: null,
    loading: false,
    error: null
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Posts
            .addCase(getPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload as Post[];
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch posts';
            })
            // Get User Posts
            .addCase(getUsersPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload as Post[];
            })
            .addCase(getUsersPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch user posts';
            })
            // Get Reposts
            .addCase(getRepost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRepost.fulfilled, (state, action) => {
                state.loading = false;
                state.rePost = action.payload as Post[];
            })
            .addCase(getRepost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch reposts';
            })
            // Create Post
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts.unshift(action.payload as Post);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create post';
            })
            // Like Post
            .addCase(likePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex((post) => post.id === (action.payload as Post).id);
                if (index !== -1) {
                    state.posts[index] = action.payload as Post;
                }
                state.loading = false;
            })
            .addCase(likePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to like post';
            })
            // Unlike Post
            .addCase(unlikePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unlikePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex((post) => post.id === (action.payload as Post).id);
                if (index !== -1) {
                    state.posts[index] = action.payload as Post;
                }
                state.loading = false;
            })
            .addCase(unlikePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to unlike post';
            })
            // Delete Post
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter((post) => post.id !== action.payload);
                if (state.currentPost?.id === action.payload) {
                    state.currentPost = null;
                }
                state.loading = false;
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete post';
            })
            // Get Single Post
            .addCase(getPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPost = action.payload as Post;
            })
            .addCase(getPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch post';
            });
    }
});

export default postSlice.reducer; 
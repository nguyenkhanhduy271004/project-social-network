import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    ADMIN_REQUEST,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILURE,
    GET_ALL_POSTS_SUCCESS,
    GET_ALL_POSTS_FAILURE,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAILURE,
    GET_ALL_GROUPS_SUCCESS,
    GET_ALL_GROUPS_FAILURE,
    DELETE_GROUP_SUCCESS,
    DELETE_GROUP_FAILURE
} from './ActionType';
import { User, Post, Group } from '../../types';

interface DashboardMetrics {
    totalUsers: number;
    totalPosts: number;
    totalStories: number;
    totalReels: number;
    totalGroups: number;
    totalComments: number;
    totalLikes: number;
    totalMessages: number;
    postsByMonth: Record<string, number>;
}

interface AdminState {
    dashboardMetrics: DashboardMetrics;
    users: User[];
    posts: Post[];
    stories: any[]; // TODO: Add proper type
    reels: any[]; // TODO: Add proper type
    groups: Group[];
    loading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    dashboardMetrics: {
        totalUsers: 0,
        totalPosts: 0,
        totalStories: 0,
        totalReels: 0,
        totalGroups: 0,
        totalComments: 0,
        totalLikes: 0,
        totalMessages: 0,
        postsByMonth: {}
    },
    users: [],
    posts: [],
    stories: [],
    reels: [],
    groups: [],
    loading: false,
    error: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // Dashboard metrics
        fetchDashboardRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchDashboardSuccess: (state, action: PayloadAction<DashboardMetrics>) => {
            state.dashboardMetrics = action.payload;
            state.loading = false;
        },
        fetchDashboardFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Users management
        fetchUsersRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
            state.loading = false;
        },
        fetchUsersFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserAdminStatusSuccess: (state, action: PayloadAction<User>) => {
            const updatedUser = action.payload;
            state.users = state.users.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            );
        },
        deleteUserSuccess: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        },

        // Posts management
        fetchPostsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchPostsSuccess: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
            state.loading = false;
        },
        fetchPostsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deletePostSuccess: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter(post => post.id !== action.payload);
        },

        // Stories management
        fetchStoriesRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchStoriesSuccess: (state, action: PayloadAction<any[]>) => {
            state.stories = action.payload;
            state.loading = false;
        },
        fetchStoriesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteStorySuccess: (state, action: PayloadAction<string>) => {
            state.stories = state.stories.filter(story => story.id !== action.payload);
        },

        // Reels management
        fetchReelsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchReelsSuccess: (state, action: PayloadAction<any[]>) => {
            state.reels = action.payload;
            state.loading = false;
        },
        fetchReelsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteReelSuccess: (state, action: PayloadAction<string>) => {
            state.reels = state.reels.filter(reel => reel.id !== action.payload);
        },

        // Groups management
        fetchGroupsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchGroupsSuccess: (state, action: PayloadAction<Group[]>) => {
            state.groups = action.payload;
            state.loading = false;
        },
        fetchGroupsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteGroupSuccess: (state, action: PayloadAction<string>) => {
            state.groups = state.groups.filter((group: Group) => group.id !== action.payload);
        },

        // String constant actions
        [ADMIN_REQUEST]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [GET_ALL_USERS_SUCCESS]: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
            state.loading = false;
        },
        [GET_ALL_USERS_FAILURE]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        [GET_ALL_POSTS_SUCCESS]: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
            state.loading = false;
        },
        [GET_ALL_POSTS_FAILURE]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        [DELETE_POST_SUCCESS]: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter(post => post.id !== action.payload);
        },
        [DELETE_POST_FAILURE]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        [GET_ALL_GROUPS_SUCCESS]: (state, action: PayloadAction<Group[]>) => {
            state.groups = action.payload;
            state.loading = false;
        },
        [GET_ALL_GROUPS_FAILURE]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        [DELETE_GROUP_SUCCESS]: (state, action: PayloadAction<string>) => {
            state.groups = state.groups.filter((group: Group) => group.id !== action.payload);
        },
        [DELETE_GROUP_FAILURE]: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export default adminSlice.reducer;

export const {
    fetchDashboardRequest,
    fetchDashboardSuccess,
    fetchDashboardFailure,
    fetchUsersRequest,
    fetchUsersSuccess,
    fetchUsersFailure,
    updateUserAdminStatusSuccess,
    deleteUserSuccess,
    fetchPostsRequest,
    fetchPostsSuccess,
    fetchPostsFailure,
    deletePostSuccess,
    fetchStoriesRequest,
    fetchStoriesSuccess,
    fetchStoriesFailure,
    deleteStorySuccess,
    fetchReelsRequest,
    fetchReelsSuccess,
    fetchReelsFailure,
    deleteReelSuccess,
    fetchGroupsRequest,
    fetchGroupsSuccess,
    fetchGroupsFailure,
    deleteGroupSuccess
} = adminSlice.actions; 
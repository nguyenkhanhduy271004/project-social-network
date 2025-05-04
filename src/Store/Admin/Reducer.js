import { createSlice } from '@reduxjs/toolkit';
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

const initialState = {
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
        fetchDashboardSuccess: (state, action) => {
            state.dashboardMetrics = action.payload;
            state.loading = false;
        },
        fetchDashboardFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Users management
        fetchUsersRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess: (state, action) => {
            state.users = action.payload;
            state.loading = false;
        },
        fetchUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserAdminStatusSuccess: (state, action) => {
            const updatedUser = action.payload;
            state.users = state.users.map(user =>
                user.id === updatedUser.id ? updatedUser : user
            );
        },
        deleteUserSuccess: (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        },

        // Posts management
        fetchPostsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchPostsSuccess: (state, action) => {
            console.log(action.payload);
            state.posts = action.payload;
            state.loading = false;
        },
        fetchPostsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deletePostSuccess: (state, action) => {
            state.posts = state.posts.filter(post => post.id !== action.payload);
        },

        // Stories management
        fetchStoriesRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchStoriesSuccess: (state, action) => {
            state.stories = action.payload;
            state.loading = false;
        },
        fetchStoriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteStorySuccess: (state, action) => {
            state.stories = state.stories.filter(story => story.id !== action.payload);
        },

        // Reels management
        fetchReelsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchReelsSuccess: (state, action) => {
            state.reels = action.payload;
            state.loading = false;
        },
        fetchReelsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteReelSuccess: (state, action) => {
            state.reels = state.reels.filter(reel => reel.id !== action.payload);
        },

        // Groups management
        fetchGroupsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchGroupsSuccess: (state, action) => {
            state.groups = action.payload;
            state.loading = false;
        },
        fetchGroupsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteGroupSuccess: (state, action) => {
            state.groups = state.groups.filter(group => group.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle admin request loading state
            .addCase(ADMIN_REQUEST, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Handle user actions from ActionType.js
            .addCase(GET_ALL_USERS_SUCCESS, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(GET_ALL_USERS_FAILURE, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle post actions from ActionType.js
            .addCase(GET_ALL_POSTS_SUCCESS, (state, action) => {
                state.posts = action.payload;
                state.loading = false;
            })
            .addCase(GET_ALL_POSTS_FAILURE, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DELETE_POST_SUCCESS, (state, action) => {
                state.posts = state.posts.filter(post => post.id !== action.payload);
            })
            .addCase(DELETE_POST_FAILURE, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle group actions from ActionType.js
            .addCase(GET_ALL_GROUPS_SUCCESS, (state, action) => {
                state.groups = action.payload;
                state.loading = false;
            })
            .addCase(GET_ALL_GROUPS_FAILURE, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(DELETE_GROUP_SUCCESS, (state, action) => {
                state.groups = state.groups.filter(group => group.id !== action.payload);
            })
            .addCase(DELETE_GROUP_FAILURE, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

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

export default adminSlice.reducer; 
import { api } from "../../config/api";
import {
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
} from "./Reducer";
import {
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILURE,
    ADMIN_REQUEST,
    GET_ALL_POSTS_SUCCESS,
    GET_ALL_POSTS_FAILURE,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAILURE,
    GET_ALL_GROUPS_SUCCESS,
    GET_ALL_GROUPS_FAILURE,
    DELETE_GROUP_SUCCESS,
    DELETE_GROUP_FAILURE
} from "./ActionType";

const API_PREFIX = process.env.REACT_APP_API_PREFIX || 'api/v1';

// Dashboard metrics actions
export const getDashboardMetrics = () => async (dispatch) => {
    try {
        dispatch(fetchDashboardRequest());
        const { data } = await api.get(`/${API_PREFIX}/admin/dashboard`);
        dispatch(fetchDashboardSuccess(data.data));
    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        dispatch(fetchDashboardFailure(error.message));
    }
};

// Users management actions
export const getAllUsers = () => async (dispatch) => {
    dispatch({ type: ADMIN_REQUEST });
    try {
        const { data } = await api.get(`/${API_PREFIX}/admin/users`);
        dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: GET_ALL_USERS_FAILURE, payload: error.message });
    }
};

export const updateUserAdminStatus = (userId, isAdmin) => async (dispatch) => {
    try {
        const { data } = await api.put(`/${API_PREFIX}/admin/users/${userId}/admin-status?isAdmin=${isAdmin}`);
        dispatch(updateUserAdminStatusSuccess(data.data));
        return data;
    } catch (error) {
        console.error("Error updating user admin status:", error);
        throw error;
    }
};

export const deleteUser = (userId) => async (dispatch) => {
    try {
        await api.delete(`/${API_PREFIX}/admin/users/${userId}`);
        dispatch(deleteUserSuccess(userId));
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

// Posts management actions
export const getAllPosts = () => async (dispatch) => {
    dispatch({ type: ADMIN_REQUEST });
    try {
        const { data } = await api.get(`/${API_PREFIX}/admin/posts`);
        dispatch({ type: GET_ALL_POSTS_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({ type: GET_ALL_POSTS_FAILURE, payload: error.message });
    }
};

export const deletePost = (postId) => async (dispatch) => {
    dispatch({ type: ADMIN_REQUEST });
    try {
        await api.delete(`/${API_PREFIX}/admin/posts/${postId}`);
        dispatch({ type: DELETE_POST_SUCCESS, payload: postId });
    } catch (error) {
        dispatch({ type: DELETE_POST_FAILURE, payload: error.message });
    }
};

// Stories management actions
export const getAllStories = () => async (dispatch) => {
    try {
        dispatch(fetchStoriesRequest());
        const { data } = await api.get(`/${API_PREFIX}/admin/stories`);
        dispatch(fetchStoriesSuccess(data.data));
    } catch (error) {
        console.error("Error fetching stories:", error);
        dispatch(fetchStoriesFailure(error.message));
    }
};

export const deleteStory = (storyId) => async (dispatch) => {
    try {
        await api.delete(`/${API_PREFIX}/admin/stories/${storyId}`);
        dispatch(deleteStorySuccess(storyId));
    } catch (error) {
        console.error("Error deleting story:", error);
        throw error;
    }
};

// Reels management actions
export const getAllReels = () => async (dispatch) => {
    try {
        dispatch(fetchReelsRequest());
        const { data } = await api.get(`/${API_PREFIX}/admin/reels`);
        console.log(data.data);
        dispatch(fetchReelsSuccess(data.data));
    } catch (error) {
        console.error("Error fetching reels:", error);
        dispatch(fetchReelsFailure(error.message));
    }
};

export const deleteReel = (reelId) => async (dispatch) => {
    try {
        await api.delete(`/${API_PREFIX}/admin/reels/${reelId}`);
        dispatch(deleteReelSuccess(reelId));
    } catch (error) {
        console.error("Error deleting reel:", error);
        throw error;
    }
};

// Groups management actions
export const getAllGroups = () => async (dispatch) => {
    dispatch({ type: ADMIN_REQUEST });
    try {
        const response = await api.get(`/${API_PREFIX}/admin/groups`);
        console.log('API response for groups:', response.data.data);
        dispatch({ type: GET_ALL_GROUPS_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.error("Error fetching groups:", error);
        dispatch({ type: GET_ALL_GROUPS_FAILURE, payload: error.message });
    }
};

export const deleteGroup = (groupId) => async (dispatch) => {
    dispatch({ type: ADMIN_REQUEST });
    try {
        await api.delete(`/${API_PREFIX}/admin/groups/${groupId}`);
        dispatch({ type: DELETE_GROUP_SUCCESS, payload: groupId });
    } catch (error) {
        dispatch({ type: DELETE_GROUP_FAILURE, payload: error.message });
    }
}; 
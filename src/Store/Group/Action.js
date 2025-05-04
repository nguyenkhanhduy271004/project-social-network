import { api } from "../../config/api";
import {
    GET_GROUPS_SUCCESS, GET_GROUPS_FAILURE,
    GET_GROUP_BY_ID_SUCCESS, GET_GROUP_BY_ID_FAILURE,
    CREATE_GROUP_SUCCESS, CREATE_GROUP_FAILURE,
    UPDATE_GROUP_SUCCESS, UPDATE_GROUP_FAILURE,
    DELETE_GROUP_SUCCESS, DELETE_GROUP_FAILURE,
    JOIN_GROUP_SUCCESS, JOIN_GROUP_FAILURE,
    LEAVE_GROUP_SUCCESS, LEAVE_GROUP_FAILURE,
    REMOVE_MEMBER_SUCCESS, REMOVE_MEMBER_FAILURE,
    CREATE_POST_SUCCESS, CREATE_POST_FAILURE,
    FETCH_USER_GROUPS_SUCCESS,
    FETCH_USER_GROUPS_FAILURE,
    GET_POSTS_BY_GROUP_SUCCESS,
    GET_POSTS_BY_GROUP_REQUEST,
    GET_POSTS_BY_GROUP_FAILURE
} from "./ActionType";

export const getGroups = () => async (dispatch) => {
    try {
        const response = await api.get(`/api/groups`);
        dispatch({ type: GET_GROUPS_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_GROUPS_FAILURE, payload: error.message });
    }
};

export const getGroupById = (groupId) => async (dispatch) => {
    try {
        const response = await api.get(`/api/groups/${groupId}`);
        dispatch({ type: GET_GROUP_BY_ID_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_GROUP_BY_ID_FAILURE, payload: error.message });
    }
};

export const createGroup = (groupData) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/groups`, groupData);
        dispatch({ type: CREATE_GROUP_SUCCESS, payload: data });
        return data;
    } catch (error) {
        console.error('Error creating group:', error);
        dispatch({ type: CREATE_GROUP_FAILURE, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const updateGroup = (groupId, updateData) => async (dispatch) => {
    try {
        const { data } = await api.put(`/api/groups/${groupId}`, updateData);
        dispatch({ type: UPDATE_GROUP_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: UPDATE_GROUP_FAILURE, payload: error.message });
    }
};

export const deleteGroup = (groupId) => async (dispatch) => {
    try {
        await api.delete(`/api/groups/${groupId}`);
        dispatch({ type: DELETE_GROUP_SUCCESS, payload: groupId });
    } catch (error) {
        console.log(error);
        dispatch({ type: DELETE_GROUP_FAILURE, payload: error.message });
    }
};

export const joinGroup = (groupId) => async (dispatch) => {
    try {
        await api.post(`/api/groups/${groupId}/join`);
        dispatch({ type: JOIN_GROUP_SUCCESS, payload: groupId });
    } catch (error) {
        console.log(error);
        dispatch({ type: JOIN_GROUP_FAILURE, payload: error.message });
    }
};

export const leaveGroup = (groupId) => async (dispatch) => {
    try {
        await api.post(`/api/groups/${groupId}/leave`);
        dispatch({ type: LEAVE_GROUP_SUCCESS, payload: groupId });
    } catch (error) {
        console.log(error);
        dispatch({ type: LEAVE_GROUP_FAILURE, payload: error.message });
    }
};

export const removeMember = (groupId, memberId) => async (dispatch) => {
    try {
        await api.delete(`/api/groups/${groupId}/members/${memberId}`);
        dispatch({ type: REMOVE_MEMBER_SUCCESS, payload: { groupId, memberId } });
    } catch (error) {
        console.log(error);
        dispatch({ type: REMOVE_MEMBER_FAILURE, payload: error.message });
    }
};

export const createPostInGroup = (groupId, postData) => async (dispatch) => {
    try {
        const formData = new FormData();
        if (postData.content) {
            formData.append("content", postData.content);
        }
        if (postData.file) {
            formData.append("file", postData.file);
        }

        const { data } = await api.post(`/api/posts/${groupId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        dispatch({ type: CREATE_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: CREATE_POST_FAILURE, payload: error.message });
    }
};


export const fetchUserGroups = () => async (dispatch) => {
    try {
        const response = await api.get(`/api/groups/my-groups`);
        dispatch({ type: FETCH_USER_GROUPS_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: FETCH_USER_GROUPS_FAILURE, payload: error.message });
    }
};

export const getPostsByGroupId = (groupId) => async (dispatch) => {
    try {
        dispatch({ type: GET_POSTS_BY_GROUP_REQUEST });

        const response = await api.get(`/api/groups/${groupId}/posts`);
        dispatch({
            type: GET_POSTS_BY_GROUP_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        console.log(error);
        dispatch({
            type: GET_POSTS_BY_GROUP_FAILURE,
            payload: error.response?.status === 404
                ? 'No posts found for this group'
                : error.message,
        });
    }
};

export const getPostsFromGroup = () => async (dispatch) => {
    try {
        dispatch({ type: GET_POSTS_BY_GROUP_REQUEST });

        const response = await api.get(`/api/groups/posts`);
        dispatch({
            type: GET_POSTS_BY_GROUP_SUCCESS,
            payload: response.data.data,
        });
    } catch (error) {
        console.log(error);
        dispatch({
            type: GET_POSTS_BY_GROUP_FAILURE,
            payload: error.response?.status === 404
                ? 'No posts found for this group'
                : error.message,
        });
    }
};

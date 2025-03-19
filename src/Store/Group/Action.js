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
    CREATE_POST_SUCCESS, CREATE_POST_FAILURE
} from "./ActionType";

export const getGroups = () => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/groups`);
        dispatch({ type: GET_GROUPS_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_GROUPS_FAILURE, payload: error.message });
    }
};

export const getGroupById = (groupId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/groups/${groupId}`);
        dispatch({ type: GET_GROUP_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_GROUP_BY_ID_FAILURE, payload: error.message });
    }
};

export const createGroup = (groupData) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/groups`, groupData);
        dispatch({ type: CREATE_GROUP_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: CREATE_GROUP_FAILURE, payload: error.message });
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
        const { data } = await api.post(`/api/groups/${groupId}/posts`, postData);
        dispatch({ type: CREATE_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: CREATE_POST_FAILURE, payload: error.message });
    }
};

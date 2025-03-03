import axios from "axios"
import { api, API_BASE_URL } from "../../config/api"
import { FIND_USER_BY_ID_FAILURE, FIND_USER_BY_ID_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_SUCCESS, GET_RANDOM_USER_FAILURE, GET_RANDOM_USER_SUCCESS, GET_USER_PROFILE_USER_FAILURE, GET_USER_PROFILE_USER_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT, REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS, SEARCH_USERS_FAILURE, SEARCH_USERS_SUCCESS, UPDATE_USER_FAILURE, UPDATE_USER_SUCCESS } from "./ActionType";

export const loginUser = (loginData) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        const data = response.data;
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
        }

        dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: LOGIN_USER_FAILURE, payload: error.message });
    }
};

export const registerUser = (registerData) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
        const data = response.data;

        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
        }

        dispatch({ type: REGISTER_USER_SUCCESS, payload: data.jwt });
    } catch (error) {
        console.log(error);
        dispatch({ type: REGISTER_USER_FAILURE, payload: error.message });
    }
};


export const getUserProfile = (jwt) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });


        dispatch({ type: GET_USER_PROFILE_USER_SUCCESS, payload: response.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_USER_PROFILE_USER_FAILURE, payload: error.message });
    }
}

export const findUserById = (userId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/user/${userId}`);

        dispatch({ type: FIND_USER_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: FIND_USER_BY_ID_FAILURE, payload: error.message });
    }
}

export const updateUserProfile = (reqData) => async (dispatch) => {
    try {
        const { data } = await api.put(`/api/user/update`, reqData);

        dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
    }
}

export const followUser = (userId) => async (dispatch) => {
    try {
        const { data } = await api.put(`/api/user/${userId}/follow`);
        dispatch({ type: FOLLOW_USER_SUCCESS, payload: { id: userId } });
    } catch (error) {
        console.log(error);
        dispatch({ type: FOLLOW_USER_FAILURE, payload: error.message });
    }
}

export const getRandomUser = () => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/user/random`);

        dispatch({ type: GET_RANDOM_USER_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_RANDOM_USER_FAILURE, payload: error.message });
    }
}

export const searchUsers = (query) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/user/search`, { params: { query } });
        dispatch({ type: SEARCH_USERS_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: SEARCH_USERS_FAILURE, payload: error.message });
    }
};


export const logout = () => async (dispatch) => {
    localStorage.removeItem("jwt");

    dispatch({ type: LOGOUT, payload: null });
}
import axios from "axios"
import { api, API_BASE_URL } from "../../config/api"
import { FIND_USER_BY_ID_FAILURE, FIND_USER_BY_ID_SUCCESS, FOLLOW_USER_FAILURE, FOLLOW_USER_SUCCESS, GET_RANDOM_USER_FAILURE, GET_RANDOM_USER_SUCCESS, GET_USER_PROFILE_USER_FAILURE, GET_USER_PROFILE_USER_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGOUT, REGISTER_USER_FAILURE, REGISTER_USER_SUCCESS, SEARCH_USERS_FAILURE, SEARCH_USERS_SUCCESS, UPDATE_USER_FAILURE, UPDATE_USER_SUCCESS } from "./ActionType";

const API_PREFIX = process.env.REACT_APP_API_PREFIX || 'api/v1';

export const googleLogin = (credential) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_REQUEST });

        const res = await fetch("http://localhost:8080/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                credential,
                clientId: "615612093999-3ommfatdj5qm627gs6um9dneft4civdv.apps.googleusercontent.com"
            }),
        });

        const data = await res.json();


        if (data.token) {
            console.log("Google login successful:", data.token);
            localStorage.setItem("token", data.token);
            dispatch({ type: LOGIN_USER_SUCCESS, payload: data.token });
        } else {
            dispatch({ type: LOGIN_USER_FAILURE, payload: "Failed to authenticate with Google" });
        }
    } catch (error) {
        console.error("Google login error:", error);
        dispatch({ type: LOGIN_USER_FAILURE, payload: error.message });
    }
};
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
        const response = await axios.get(`${API_BASE_URL}/${API_PREFIX}/user/profile`, {
            headers: {
                "Authorization": `Bearer ${jwt}`
            }
        });


        dispatch({ type: GET_USER_PROFILE_USER_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_USER_PROFILE_USER_FAILURE, payload: error.message });
    }
}

export const findUserById = (userId) => async (dispatch) => {
    try {
        const response = await api.get(`/${API_PREFIX}/user/${userId}`);
        dispatch({ type: FIND_USER_BY_ID_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: FIND_USER_BY_ID_FAILURE, payload: error.message });
    }
}

export const updateUserProfile = (formData) => async (dispatch) => {
    try {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            throw new Error("No authentication token found");
        }

        const { data } = await api.put(`/${API_PREFIX}/user`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (data.status === 200) {
            dispatch({ type: UPDATE_USER_SUCCESS, payload: data.data });
            return data;
        } else {
            throw new Error(data.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Update profile error:', error);
        dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
        throw error;
    }
}

export const followUser = (userId) => async (dispatch) => {
    try {
        const { data } = await api.put(`/${API_PREFIX}/user/${userId}/follow`);
        dispatch({ type: FOLLOW_USER_SUCCESS, payload: { id: userId } });
    } catch (error) {
        console.log(error);
        dispatch({ type: FOLLOW_USER_FAILURE, payload: error.message });
    }
}

export const getRandomUser = () => async (dispatch) => {
    try {
        const { data } = await api.get(`/${API_PREFIX}/user/random`);

        dispatch({ type: GET_RANDOM_USER_SUCCESS, payload: data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_RANDOM_USER_FAILURE, payload: error.message });
    }
}

export const searchUsers = (query) => async (dispatch) => {
    try {
        // Determine if query is a user ID (number) or a search term
        const isUserId = !isNaN(query) && String(parseInt(query)) === String(query);

        let endpoint = '/${API_PREFIX}/user/search';
        let params = { query };

        // If it looks like a user ID, use the find user endpoint
        if (isUserId) {
            endpoint = `/${API_PREFIX}/user/${query}`;
            params = {};
        }

        const { data } = await api.get(endpoint, { params });

        // Handle response based on which endpoint was called
        let users = [];
        if (isUserId) {
            // If we used findUserById, we need to wrap the single user in an array
            users = data.data ? [data.data] : [];
        } else {
            // If we used the search endpoint, data should already be an array
            users = data || [];
        }

        dispatch({ type: SEARCH_USERS_SUCCESS, payload: users });
        return users; // Return users for use in components
    } catch (error) {
        console.log(error);
        dispatch({ type: SEARCH_USERS_FAILURE, payload: error.message });
        return []; // Return empty array on error
    }
};


export const logout = () => async (dispatch) => {
    localStorage.removeItem("jwt");

    dispatch({ type: LOGOUT, payload: null });
}
import { API_BASE_URL } from '../../config/api';

export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const GET_HISTORY_MESSAGE_REQUEST = 'GET_HISTORY_MESSAGE_REQUEST';
export const GET_HISTORY_MESSAGE_SUCCESS = 'GET_HISTORY_MESSAGE_SUCCESS';
export const GET_HISTORY_MESSAGE_FAILURE = 'GET_HISTORY_MESSAGE_FAILURE';
export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILURE = 'GET_USER_FAILURE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const RESET_UNREAD_MESSAGES = 'RESET_UNREAD_MESSAGES';
export const SET_MESSAGES = 'SET_MESSAGES';
export const SET_USERS = 'SET_USERS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

const API_PREFIX = process.env.REACT_APP_API_PREFIX || 'api/v1';

export const setMessages = (messages) => ({
    type: SET_MESSAGES,
    payload: messages
});

export const setUsers = (users) => ({
    type: SET_USERS,
    payload: users
});

export const setLoading = (isLoading) => ({
    type: SET_LOADING,
    payload: isLoading
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error
});

export const addMessage = (message, currentUserId, currentPath) => ({
    type: ADD_MESSAGE,
    payload: message,
    currentUserId,
    currentPath
});

export const resetUnreadMessages = (userId) => ({
    type: RESET_UNREAD_MESSAGES,
    payload: { userId }
});

export const sendMessage = (messageData) => async (dispatch) => {
    try {
        dispatch({ type: SEND_MESSAGE_REQUEST });
        const res = await fetch(`${API_BASE_URL}/${API_PREFIX}/messages/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify(messageData)
        });
        const data = await res.json();
        dispatch({ type: SEND_MESSAGE_SUCCESS, payload: data });
        return data;
    } catch (error) {
        console.error('Error sending message:', error);
        dispatch({ type: SEND_MESSAGE_FAILURE, payload: error.message });
        throw error;
    }
};

export const getHistoryMessage = (receiverId) => async (dispatch) => {
    try {
        dispatch({ type: GET_HISTORY_MESSAGE_REQUEST });
        const res = await fetch(`${API_BASE_URL}/${API_PREFIX}/messages/history?receiverId=${receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        const data = await res.json();
        dispatch({ type: GET_HISTORY_MESSAGE_SUCCESS, payload: data });
        dispatch(resetUnreadMessages(receiverId));
    } catch (error) {
        console.error('Error fetching message history:', error);
        dispatch({ type: GET_HISTORY_MESSAGE_FAILURE, payload: error.message });
    }
};

export const getUser = () => async (dispatch) => {
    try {
        dispatch({ type: GET_USER_REQUEST });
        const res = await fetch(`${API_BASE_URL}/${API_PREFIX}/messages/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            }
        });
        const data = await res.json();
        dispatch({ type: GET_USER_SUCCESS, payload: data });
    } catch (error) {
        console.error('Error fetching users:', error);
        dispatch({ type: GET_USER_FAILURE, payload: error.message });
    }
};

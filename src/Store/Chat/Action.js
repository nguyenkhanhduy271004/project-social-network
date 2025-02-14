import { api } from "../../config/api";
import { SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE, GET_HISTORY_MESSAGE_SUCCESS, GET_HISTORY_MESSAGE_FAILURE, GET_USER_SUCCESS, GET_USER_FAILURE } from "./ActionType";

export const sendMessage = (messageData) => async (dispatch) => {
    try {
        const { data } = await api.post("/api/messages/send", messageData);
        dispatch({ type: SEND_MESSAGE_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: SEND_MESSAGE_FAILURE, payload: error.message });
    }
};

export const getHistoyMessage = (receiverId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/messages/history?receiverId=${receiverId}`);
        dispatch({ type: GET_HISTORY_MESSAGE_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_HISTORY_MESSAGE_FAILURE, payload: error.message });
    }
};

export const getUser = () => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/messages/user`);
        dispatch({ type: GET_USER_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_USER_FAILURE, payload: error.message });
    }
}

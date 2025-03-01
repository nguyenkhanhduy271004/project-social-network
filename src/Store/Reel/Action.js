import { api } from "../../config/api";
import {
    CREATE_REEL_FAILURE, CREATE_REEL_SUCCESS,
    DELETE_REEL_FAILURE, DELETE_REEL_SUCCESS,
    GET_REELS_FAILURE, GET_REELS_SUCCESS,
    GET_REEL_FAILURE, GET_REEL_SUCCESS
} from "./ActionType";

export const createReel = ({ file, content }) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("content", content);

        const { data } = await api.post(`/api/reel/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        console.log("Create Reel:", data);
        dispatch({ type: CREATE_REEL_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: CREATE_REEL_FAILURE, payload: error.message });
    }
};

export const getReelById = (reelId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/reel/${reelId}`);
        dispatch({ type: GET_REEL_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_REEL_FAILURE, payload: error.message });
    }
};

export const deleteReel = (reelId) => async (dispatch) => {
    try {
        await api.delete(`/api/reel/${reelId}`);
        console.log("Reel deleted successfully");
        dispatch({ type: DELETE_REEL_SUCCESS, payload: reelId });
    } catch (error) {
        console.log(error);
        dispatch({ type: DELETE_REEL_FAILURE, payload: error.message });
    }
};

export const getReels = () => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/reel/`);
        dispatch({ type: GET_REELS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_REELS_FAILURE, payload: error.message });
    }
};

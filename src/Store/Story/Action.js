import { api } from "../../config/api";
import { CREATE_STORY_FAILURE, CREATE_STORY_SUCCESS, DELETE_STORY_FAILURE, DELETE_STORY_SUCCESS, GET_STORIES_FAILURE, GET_STORIES_SUCCESS, GET_STORY_FAILURE, GET_STORY_SUCCESS } from "./ActionType";


export const createStory = ({ file, content }) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("content", content);

        const { data } = await api.post(`/api/story/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        console.log("Create Story:", data);
        dispatch({ type: CREATE_STORY_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: CREATE_STORY_FAILURE, payload: error.message });
    }
};

export const getStoryById = (storyId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/story/${storyId}`);
        dispatch({ type: GET_STORY_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_STORY_FAILURE, payload: error.message });
    }
};

export const deleteStory = (storyId) => async (dispatch) => {
    try {
        await api.delete(`/api/story/${storyId}`);
        console.log("Story deleted successfully");
        dispatch({ type: DELETE_STORY_SUCCESS, payload: storyId });
    } catch (error) {
        console.log(error);
        dispatch({ type: DELETE_STORY_FAILURE, payload: error.message });
    }
};

export const getStories = () => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/story/`);
        dispatch({ type: GET_STORIES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_STORIES_FAILURE, payload: error.message });
    }
};
import { api } from "../../config/api";
import { FIND_POST_BY_ID_FAILURE, FIND_POST_BY_ID_SUCCESS, GET_ALL_POSTS_FAILURE, GET_ALL_POSTS_SUCCESS, GET_USER_POSTS_FAILURE, GET_USER_POSTS_SUCCESS, LIKE_POST_FAILURE, LIKE_POST_SUCCESS, POST_CREATE_FAILURE, POST_CREATE_SUCCESS, POST_DELETE_FAILURE, POST_DELETE_SUCCESS, REPLY_POST_FAILURE, REPLY_POST_SUCCESS, RPOST_FAILURE, RPOST_SUCCESS, USER_LIKE_POST_FAILURE, USER_LIKE_POST_SUCCESS } from "./ActionType";

export const getAllPosts = () => async (dispatch) => {
    try {
        const { data } = await api.get("/api/posts/");
        console.log("Get all posts", data);
        dispatch({ type: GET_ALL_POSTS_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_ALL_POSTS_FAILURE, payload: error.message });
    }
}

export const getUsersPost = (userId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/posts/user/${userId}`);
        console.log("Get all posts", data);
        dispatch({ type: GET_USER_POSTS_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_USER_POSTS_FAILURE, payload: error.message });
    }
}

export const findPostsByLikeContainUser = (userId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/posts/user/${userId}/likes`);
        console.log("Get all posts", data);
        dispatch({ type: USER_LIKE_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: USER_LIKE_POST_FAILURE, payload: error.message });
    }
}

export const findPostsById = (postId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/posts/${postId}`);
        console.log("Get all posts", data);
        dispatch({ type: FIND_POST_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: FIND_POST_BY_ID_FAILURE, payload: error.message });
    }
}

export const createPost = (postData) => async (dispatch) => {
    try {
        const formData = new FormData();
        formData.append("file", postData.file);
        formData.append("content", postData.content);

        const { data } = await api.post(`/api/posts/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        console.log("Create Post:", data);
        dispatch({ type: POST_CREATE_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: POST_CREATE_FAILURE, payload: error.message });
    }
};


export const createPostReply = (postData) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/posts/reply`, postData);
        console.log("Get all posts", data);
        dispatch({ type: REPLY_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: REPLY_POST_FAILURE, payload: error.message });
    }
}

export const createRePost = (postId) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/posts/${postId}/repost`);
        console.log("Get all posts", data);
        dispatch({ type: RPOST_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: RPOST_FAILURE, payload: error.message });
    }
}

export const likePost = (postId) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/${postId}/likes`);
        console.log("Get all posts", data);
        dispatch({ type: LIKE_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: LIKE_POST_FAILURE, payload: error.message });
    }
}

export const deletePost = (postId) => async (dispatch) => {
    try {
        const { data } = await api.delete(`/api/posts/${postId}`);
        console.log("Get all posts", data);
        dispatch({ type: POST_DELETE_SUCCESS, payload: postId });
    } catch (error) {
        console.log(error);
        dispatch({ type: POST_DELETE_FAILURE, payload: error.message });
    }
}

import { api } from "../../config/api";
import { ADD_COMMENT_POST_FAILURE, ADD_COMMENT_POST_SUCCESS, FIND_POST_BY_ID_FAILURE, FIND_POST_BY_ID_SUCCESS, GET_ALL_POSTS_FAILURE, GET_ALL_POSTS_SUCCESS, GET_COMMENT_POST_FAILURE, GET_COMMENT_POST_SUCCESS, GET_REPOST_FAILURE, GET_REPOST_SUCCESS, GET_USER_POSTS_FAILURE, GET_USER_POSTS_SUCCESS, LIKE_POST_FAILURE, LIKE_POST_SUCCESS, POST_CREATE_FAILURE, POST_CREATE_SUCCESS, POST_DELETE_FAILURE, POST_DELETE_SUCCESS, POST_EDIT_FAILURE, POST_EDIT_SUCCESS, REPLY_POST_FAILURE, REPLY_POST_SUCCESS, RPOST_FAILURE, RPOST_SUCCESS, USER_LIKE_POST_FAILURE, USER_LIKE_POST_SUCCESS } from "./ActionType";

export const getAllPosts = () => async (dispatch) => {
    try {
        const response = await api.get("/api/posts/");
        dispatch({ type: GET_ALL_POSTS_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_ALL_POSTS_FAILURE, payload: error.message });
    }
}

export const getUsersPost = (userId) => async (dispatch) => {
    try {
        const response = await api.get(`/api/posts/user/${userId}`);
        dispatch({ type: GET_USER_POSTS_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_USER_POSTS_FAILURE, payload: error.message });
    }
}

export const findPostsByLikeContainUser = (userId) => async (dispatch) => {
    try {
        const response = await api.get(`/api/posts/user/${userId}/likes`);
        dispatch({ type: USER_LIKE_POST_SUCCESS, payload: response.data.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: USER_LIKE_POST_FAILURE, payload: error.message });
    }
}

export const findPostsById = (postId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/posts/${postId}`);
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

export const editPost = (postId, postData) => async (dispatch) => {
    try {
        const formData = new FormData();
        if (postData.file) {
            formData.append("file", postData.file);
        }
        formData.append("content", postData.content);

        const { data } = await api.put(`/api/posts/${postId}/edit`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        console.log("Edit Post:", data);
        dispatch({ type: POST_EDIT_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: POST_EDIT_FAILURE, payload: error.message });
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
        const { data } = await api.put(`/api/posts/${postId}/repost`);
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

export const createComment = (req) => async (dispatch) => {
    try {
        const { data } = await api.post(`/api/posts/${req.postId}/comment`, req);
        dispatch({ type: ADD_COMMENT_POST_SUCCESS, payload: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: ADD_COMMENT_POST_FAILURE, payload: error.message });
    }
}

export const getComments = (postId) => async (dispatch) => {
    try {
        const { data } = await api.get(`/api/posts/${postId}/comment`);
        dispatch({
            type: GET_COMMENT_POST_SUCCESS, payload: {
                postId: postId,
                comments: data
            }
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_COMMENT_POST_FAILURE, payload: error.message });
    }
}

export const getRepost = () => async (dispatch) => {
    try {
        const response = await api.get(`/api/posts/repost`);
        dispatch({
            type: GET_REPOST_SUCCESS, payload: response.data.data
        });
    } catch (error) {
        console.log(error);
        dispatch({ type: GET_REPOST_FAILURE, payload: error.message });
    }
}
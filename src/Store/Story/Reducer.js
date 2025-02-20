import {
    CREATE_STORY_REQUEST,
    CREATE_STORY_SUCCESS,
    CREATE_STORY_FAILURE,
    GET_STORY_REQUEST,
    GET_STORY_SUCCESS,
    GET_STORY_FAILURE,
    DELETE_STORY_REQUEST,
    DELETE_STORY_SUCCESS,
    DELETE_STORY_FAILURE,
    GET_STORIES_REQUEST,
    GET_STORIES_FAILURE,
    GET_STORIES_SUCCESS,
} from "./ActionType";

const initialState = {
    story: null,
    loading: false,
    error: null,
    stories: []
};

export const storyReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_STORY_REQUEST:
        case GET_STORY_REQUEST:
        case DELETE_STORY_REQUEST:
        case GET_STORIES_REQUEST:
            return { ...state, loading: true, error: null };

        case CREATE_STORY_SUCCESS:
            return { ...state, loading: false, story: action.payload };

        case GET_STORY_SUCCESS:
            return { ...state, loading: false, story: action.payload };

        case DELETE_STORY_SUCCESS:
            return { ...state, loading: false, story: null };
        case GET_STORIES_SUCCESS:
            return { ...state, loading: false, stories: null };

        case CREATE_STORY_FAILURE:
        case GET_STORY_FAILURE:
        case DELETE_STORY_FAILURE:
        case GET_STORIES_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
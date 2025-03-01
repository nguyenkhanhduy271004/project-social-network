import {
    CREATE_REEL_REQUEST,
    CREATE_REEL_SUCCESS,
    CREATE_REEL_FAILURE,
    GET_REEL_REQUEST,
    GET_REEL_SUCCESS,
    GET_REEL_FAILURE,
    DELETE_REEL_REQUEST,
    DELETE_REEL_SUCCESS,
    DELETE_REEL_FAILURE,
    GET_REELS_REQUEST,
    GET_REELS_FAILURE,
    GET_REELS_SUCCESS,
} from "./ActionType";

const initialState = {
    reel: null,
    loading: false,
    error: null,
    reels: []
};

export const reelReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_REEL_REQUEST:
        case GET_REEL_REQUEST:
        case DELETE_REEL_REQUEST:
        case GET_REELS_REQUEST:
            return { ...state, loading: true, error: null };

        case CREATE_REEL_SUCCESS:
            return {
                ...state,
                loading: false,
                reels: [...state.reels, action.payload]
            };
        case GET_REEL_SUCCESS:
            return { ...state, loading: false, reel: action.payload };

        case DELETE_REEL_SUCCESS:
            return { ...state, loading: false, reel: null };
        case GET_REELS_SUCCESS:
            return { ...state, loading: false, reels: action.payload };

        case CREATE_REEL_FAILURE:
        case GET_REEL_FAILURE:
        case DELETE_REEL_FAILURE:
        case GET_REELS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

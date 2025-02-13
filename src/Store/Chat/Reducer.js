import { SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE, GET_HISTORY_MESSAGE_REQUEST, GET_HISTORY_MESSAGE_SUCCESS, GET_HISTORY_MESSAGE_FAILURE } from "./ActionType";

const initialState = {
    loading: false,
    messages: [],
    error: null
};

export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_MESSAGE_REQUEST:
            return {
                ...state,
                loading: true
            };

        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: [...state.messages, action.payload]
            };

        case SEND_MESSAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case GET_HISTORY_MESSAGE_REQUEST:
            return {
                ...state,
                loading: true
            };

        case GET_HISTORY_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: action.payload
            };

        case GET_HISTORY_MESSAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};

import { SEND_MESSAGE_REQUEST, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAILURE, GET_HISTORY_MESSAGE_REQUEST, GET_HISTORY_MESSAGE_SUCCESS, GET_HISTORY_MESSAGE_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE } from "./ActionType";

const initialState = {
    loading: false,
    messages: [],
    users: [],
    error: null,
    notifications: {}
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
                // messages: [...state.messages, action.payload]
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
        case GET_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case GET_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload
            };

        case GET_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case "ADD_MESSAGE":
            console.log(action.payload)
            return {
                ...state,
                messages: [
                    ...state.messages,
                    {
                        ...action.payload,
                        timestamp: action.payload.timestamp
                            ? new Date(action.payload.timestamp).toISOString()
                            : new Date().toISOString()
                    }
                ]
            };
        case "ADD_NOTIFICATION":
            console.log("Action received:", action.payload);
            console.log(state.notifications);
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    [action.payload.receiverId]: (state.notifications[action.payload.receiverId] || 0) + 1
                }
            };
        case "RESET_NOTIFICATION":
            return {
                ...state,
                notifications: {
                    ...state.notifications,
                    [action.payload.receiverId]: 0
                }
            };
        default:
            return state;
    }
};

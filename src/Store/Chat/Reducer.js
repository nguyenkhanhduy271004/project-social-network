import {
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAILURE,
    GET_HISTORY_MESSAGE_REQUEST,
    GET_HISTORY_MESSAGE_SUCCESS,
    GET_HISTORY_MESSAGE_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    ADD_MESSAGE,
    RESET_UNREAD_MESSAGES,
    SET_MESSAGES,
    SET_USERS,
    SET_LOADING,
    SET_ERROR
} from './Action';

const initialState = {
    messages: [],
    users: [],
    loading: false,
    error: null,
    unreadMessages: 0,
    messagesByUser: {} // Track messages by user
};

export const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_MESSAGE_REQUEST:
        case GET_HISTORY_MESSAGE_REQUEST:
        case GET_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case SEND_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null
            };

        case GET_HISTORY_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: action.payload,
                error: null
            };

        case GET_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload,
                error: null
            };

        case SEND_MESSAGE_FAILURE:
        case GET_HISTORY_MESSAGE_FAILURE:
        case GET_USER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case ADD_MESSAGE:
            const newMessage = action.payload;
            const isCurrentUserReceiver = newMessage.receiverId === action.currentUserId;
            const isInMessagePage = action.currentPath?.includes('/message');
            const shouldIncrementUnread = isCurrentUserReceiver && !isInMessagePage;

            return {
                ...state,
                messages: [...state.messages, newMessage],
                unreadMessages: shouldIncrementUnread ? state.unreadMessages + 1 : state.unreadMessages,
                messagesByUser: {
                    ...state.messagesByUser,
                    [newMessage.senderId]: {
                        ...state.messagesByUser[newMessage.senderId],
                        unread: shouldIncrementUnread ?
                            (state.messagesByUser[newMessage.senderId]?.unread || 0) + 1 :
                            state.messagesByUser[newMessage.senderId]?.unread || 0,
                        lastMessage: newMessage
                    }
                },
                error: null
            };

        case RESET_UNREAD_MESSAGES:
            return {
                ...state,
                unreadMessages: 0,
                messagesByUser: {
                    ...state.messagesByUser,
                    [action.payload.userId]: {
                        ...state.messagesByUser[action.payload.userId],
                        unread: 0
                    }
                }
            };

        case SET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                error: null
            };

        case SET_USERS:
            return {
                ...state,
                users: action.payload,
                error: null
            };

        case SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case SET_ERROR:
            return {
                ...state,
                error: action.payload
            };

        default:
            return state;
    }
};

import {
    GET_GROUPS_REQUEST, GET_GROUPS_SUCCESS, GET_GROUPS_FAILURE,
    GET_GROUP_BY_ID_REQUEST, GET_GROUP_BY_ID_SUCCESS, GET_GROUP_BY_ID_FAILURE,
    CREATE_GROUP_REQUEST, CREATE_GROUP_SUCCESS, CREATE_GROUP_FAILURE,
    UPDATE_GROUP_REQUEST, UPDATE_GROUP_SUCCESS, UPDATE_GROUP_FAILURE,
    DELETE_GROUP_REQUEST, DELETE_GROUP_SUCCESS, DELETE_GROUP_FAILURE,
    JOIN_GROUP_REQUEST, JOIN_GROUP_SUCCESS, JOIN_GROUP_FAILURE,
    LEAVE_GROUP_REQUEST, LEAVE_GROUP_SUCCESS, LEAVE_GROUP_FAILURE,
    REMOVE_MEMBER_REQUEST, REMOVE_MEMBER_SUCCESS, REMOVE_MEMBER_FAILURE,
    CREATE_POST_REQUEST, CREATE_POST_SUCCESS, CREATE_POST_FAILURE
} from "./ActionType";

const initialState = {
    groups: [],
    group: null,
    loading: false,
    error: null
};

export const groupReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_GROUPS_REQUEST:
        case GET_GROUP_BY_ID_REQUEST:
        case CREATE_GROUP_REQUEST:
        case UPDATE_GROUP_REQUEST:
        case DELETE_GROUP_REQUEST:
        case JOIN_GROUP_REQUEST:
        case LEAVE_GROUP_REQUEST:
        case REMOVE_MEMBER_REQUEST:
        case CREATE_POST_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_GROUPS_SUCCESS:
            return { ...state, loading: false, groups: action.payload };

        case GET_GROUP_BY_ID_SUCCESS:
            return { ...state, loading: false, group: action.payload };

        case CREATE_GROUP_SUCCESS:
            return { ...state, loading: false, groups: [...state.groups, action.payload] };

        case UPDATE_GROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                groups: state.groups.map(group =>
                    group.id === action.payload.id ? action.payload : group
                )
            };

        case DELETE_GROUP_SUCCESS:
            return {
                ...state,
                loading: false,
                groups: state.groups.filter(group => group.id !== action.payload)
            };

        case JOIN_GROUP_SUCCESS:
        case LEAVE_GROUP_SUCCESS:
        case REMOVE_MEMBER_SUCCESS:
        case CREATE_POST_SUCCESS:
            return { ...state, loading: false, group: action.payload };

        case GET_GROUPS_FAILURE:
        case GET_GROUP_BY_ID_FAILURE:
        case CREATE_GROUP_FAILURE:
        case UPDATE_GROUP_FAILURE:
        case DELETE_GROUP_FAILURE:
        case JOIN_GROUP_FAILURE:
        case LEAVE_GROUP_FAILURE:
        case REMOVE_MEMBER_FAILURE:
        case CREATE_POST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};


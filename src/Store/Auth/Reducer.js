import { FIND_USER_BY_ID_SUCCESS, FOLLOW_USER_SUCCESS, GET_RANDOM_USER_REQUEST, GET_RANDOM_USER_SUCCESS, GET_USER_PROFILE_USER_FAILURE, GET_USER_PROFILE_USER_REQUEST, GET_USER_PROFILE_USER_SUCCESS, LOGIN_USER_FAILURE, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGOUT, REGISTER_USER_FAILURE, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, SEARCH_USERS_FAILURE, SEARCH_USERS_REQUEST, SEARCH_USERS_SUCCESS, UPDATE_USER_SUCCESS } from "./ActionType";

const initialState = {
    user: null,
    loading: false,
    error: null,
    jwt: null,
    users: []
}
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER_REQUEST:
        case REGISTER_USER_REQUEST:
        case GET_USER_PROFILE_USER_REQUEST:
        case GET_RANDOM_USER_REQUEST:
        case SEARCH_USERS_REQUEST:
            return { ...state, loading: true, error: null }
        case LOGIN_USER_SUCCESS:
        case REGISTER_USER_SUCCESS:
            return { ...state, loading: false, error: null, jwt: action.payload }
        case GET_USER_PROFILE_USER_SUCCESS:
            return { ...state, loading: false, error: null, user: action.payload }
        case UPDATE_USER_SUCCESS:
            return { ...state, loading: false, error: null, user: action.payload, updateUser: true }
        case FIND_USER_BY_ID_SUCCESS:
            return { ...state, loading: false, error: null, findUser: action.payload }
        case GET_RANDOM_USER_SUCCESS:
            return { ...state, loading: false, error: null, users: action.payload }
        case FOLLOW_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                users: state.users.filter(user => user.id !== action.payload.id)
            };
        case SEARCH_USERS_SUCCESS:
            return { ...state, loading: false, error: null, userSearch: action.payload }
        case LOGIN_USER_FAILURE:
            return { ...state, loading: false, error: "Tài khoản hoặc mật khẩu sai" }
        case REGISTER_USER_FAILURE:
            return { ...state, loading: false, error: "Đăng kí thất bại" }
        case GET_USER_PROFILE_USER_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case SEARCH_USERS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case LOGOUT:
            return initialState
        default:
            return state;
    }
}
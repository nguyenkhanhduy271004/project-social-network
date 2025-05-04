import { ADD_NOTIFICATION, CLEAR_NOTIFICATIONS, REMOVE_FROM_TOAST_LIST } from "./ActionType";

const initialState = {
    value: {
        notifs: [],
        notifToastList: [],
    },
};

const deliveredNotifsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            const newNotifs = Array.isArray(action.payload.newNotifs)
                ? action.payload.newNotifs
                : action.payload.newNotifs ? [action.payload.newNotifs] : [];

            return {
                ...state,
                value: {
                    notifs: [...state.value.notifs, ...newNotifs],
                    notifToastList: [...state.value.notifToastList, ...newNotifs],
                },
            };

        case CLEAR_NOTIFICATIONS:
            return {
                ...state,
                value: {
                    ...state.value,
                    notifs: [],
                },
            };

        case REMOVE_FROM_TOAST_LIST:
            return {
                ...state,
                value: {
                    ...state.value,
                    notifToastList: state.value.notifToastList.filter(
                        (x) => x.id !== action.payload.notif.id
                    ),
                },
            };

        default:
            return state;
    }
};

export default deliveredNotifsReducer;

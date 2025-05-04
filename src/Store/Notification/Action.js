import { ADD_NOTIFICATION, CLEAR_NOTIFICATIONS, REMOVE_FROM_TOAST_LIST } from "./ActionType";

export const addNotification = (data) => ({
    type: ADD_NOTIFICATION,
    payload: {
        newNotifs: data.newNotifs || []
    },
});

export const clearNotifications = () => ({
    type: CLEAR_NOTIFICATIONS,
});

export const removeFromToastList = (notif) => ({
    type: REMOVE_FROM_TOAST_LIST,
    payload: { notif },
});

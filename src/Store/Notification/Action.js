import { createAction } from '@reduxjs/toolkit';

// Action types
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const MARK_NOTIFICATIONS_AS_READ = 'MARK_NOTIFICATIONS_AS_READ';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const REMOVE_FROM_TOAST_LIST = 'REMOVE_FROM_TOAST_LIST';

// Action creators
export const addNotification = createAction(ADD_NOTIFICATION);
export const markNotificationsAsRead = createAction(MARK_NOTIFICATIONS_AS_READ);
export const clearNotifications = createAction(CLEAR_NOTIFICATIONS);
export const removeFromToastList = (notif) => ({
    type: REMOVE_FROM_TOAST_LIST,
    payload: { notif },
});

// Thunk action for marking notifications as read
export const markAllNotificationsAsRead = () => (dispatch) => {
    dispatch(markNotificationsAsRead());
};

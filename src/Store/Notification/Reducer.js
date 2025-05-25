import { createReducer } from '@reduxjs/toolkit';
import { ADD_NOTIFICATION, MARK_NOTIFICATIONS_AS_READ, CLEAR_NOTIFICATIONS } from './Action';

const initialState = {
    notifications: [],
    unreadCount: 0
};

const notificationReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(ADD_NOTIFICATION, (state, action) => {
            const newNotification = {
                ...action.payload,
                id: Date.now(),
                read: false,
                timestamp: new Date().toISOString()
            };
            state.notifications.unshift(newNotification);
            state.unreadCount += 1;
        })
        .addCase(MARK_NOTIFICATIONS_AS_READ, (state) => {
            state.notifications = state.notifications.map(notification => ({
                ...notification,
                read: true
            }));
            state.unreadCount = 0;
        })
        .addCase(CLEAR_NOTIFICATIONS, (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        });
});

export default notificationReducer;

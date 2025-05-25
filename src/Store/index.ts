import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import postReducer from './reducers/post';
import chatReducer from './reducers/chat';
import userReducer from './reducers/user';
import { RootState } from '../types';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        chat: chatReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk = typeof store.dispatch; 
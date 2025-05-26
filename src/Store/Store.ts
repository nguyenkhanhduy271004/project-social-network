import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import postReducer from './reducers/post';
import chatReducer from './reducers/chat';
import userReducer from './reducers/user';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        chat: chatReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
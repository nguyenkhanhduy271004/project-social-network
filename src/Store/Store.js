import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './Auth/Reducer';
import { postReducer } from './Post/Reducer';
import { storyReducer } from './Story/Reducer';
import { chatReducer } from './Chat/Reducer';
import { reelReducer } from './Reel/Reducer';
import { groupReducer } from './Group/Reducer';
import adminReducer from './Admin/Reducer';
import deliveredNotifsReducer from './Notification/Reducer';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
        story: storyReducer,
        chat: chatReducer,
        reel: reelReducer,
        group: groupReducer,
        admin: adminReducer,
        deliveredNotifs: deliveredNotifsReducer
    }
});

export default store;
import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";
import { postReducer } from "./Post/Reducer";
import { chatReducer } from "./Chat/Reducer";
import { storyReducer } from "./Story/Reducer";

const rootReducers = combineReducers({
    auth: authReducer,
    post: postReducer,
    chat: chatReducer,
    story: storyReducer,
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
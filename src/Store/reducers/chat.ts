import { createSlice } from '@reduxjs/toolkit';

interface ChatState {
    conversations: any[];
    currentConversation: any | null;
    messages: any[];
    loading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
});

export const { setCurrentConversation, addMessage } = chatSlice.actions;
export default chatSlice.reducer; 
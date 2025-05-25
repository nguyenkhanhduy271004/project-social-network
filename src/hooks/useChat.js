import { useSelector, useDispatch } from 'react-redux';
import { getConversations, getMessages, sendMessage } from '../Store/actions/chat';

export const useChat = () => {
    const dispatch = useDispatch();
    const { conversations, messages, loading, error } = useSelector(state => state.chat);

    const fetchConversations = async () => {
        try {
            const response = await dispatch(getConversations());
            return response;
        } catch (error) {
            console.error('Fetch conversations error:', error);
            throw error;
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await dispatch(getMessages(conversationId));
            return response;
        } catch (error) {
            console.error('Fetch messages error:', error);
            throw error;
        }
    };

    const sendNewMessage = async (conversationId, content) => {
        try {
            const response = await dispatch(sendMessage({ conversationId, content }));
            return response;
        } catch (error) {
            console.error('Send message error:', error);
            throw error;
        }
    };

    return {
        conversations,
        messages,
        loading,
        error,
        fetchConversations,
        fetchMessages,
        sendNewMessage,
    };
}; 
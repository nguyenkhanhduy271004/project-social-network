import { api } from '../config/api';

const DEEPSEEK_URL = 'api/ai';

export const sendMessage = async (message) => {
    try {
        const { data } = await api.get(`${DEEPSEEK_URL}/generate`, {
            params: { message }
        });
        if (data.error) {
            throw new Error(data.error);
        }
        return { response: data.generation };
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const sendStreamMessage = async (message, onChunk) => {
    try {
        const response = await fetch(`${api.defaults.baseURL}${DEEPSEEK_URL}/generateStream?message=${encodeURIComponent(message)}`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.result?.output?.content) {
                            onChunk(data.result.output.content);
                        }
                    } catch (e) {
                        console.error('Error parsing stream chunk:', e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in stream:', error);
        throw error;
    }
}; 
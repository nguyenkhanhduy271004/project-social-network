import React, { createContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { API_BASE_URL } from '../config/api';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const isConnected = useRef(false);

    useEffect(() => {
        const sock = new SockJS(`${API_BASE_URL}/ws`);
        const stomp = Stomp.over(sock);

        stomp.connect({}, () => {
            console.log("WebSocket connected");
            setStompClient(stomp);
            isConnected.current = true;
        }, (error) => {
            console.error("WebSocket connection error:", error);
            isConnected.current = false;
        });

        return () => {
            if (isConnected.current) {
                stomp.disconnect(() => console.log("🔌 WebSocket disconnected"));
            }
        };
    }, []);

    const sendMessage = (roomId, message) => {
        if (stompClient && stompClient.connected) {
            stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message));
        } else {
            console.warn("WebSocket not connected.");
        }
    };

    const subscribeToRoom = (roomId, callback) => {
        if (stompClient && stompClient.connected) {
            return stompClient.subscribe(`/user/${roomId}/private`, (message) => {
                const newMessage = JSON.parse(message.body);
                callback(newMessage);
            });
        }
    };

    return (
        <WebSocketContext.Provider value={{ stompClient, sendMessage, subscribeToRoom }}>
            {children}
        </WebSocketContext.Provider>
    );
};

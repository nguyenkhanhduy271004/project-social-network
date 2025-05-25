import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_BASE_URL } from '../config/api';

class NotificationService {
    constructor() {
        this.stompClient = null;
        this.subscription = null;
        this.notificationCallbacks = new Set();
    }

    connect(userId) {
        if (this.stompClient && this.stompClient.connected) {
            console.log('WebSocket already connected');
            return;
        }

        const socketUrl = `${API_BASE_URL}/ws`;
        console.log('Connecting to WebSocket at:', socketUrl);

        const socket = new SockJS(socketUrl);
        this.stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log('STOMP Debug:', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onWebSocketError: (event) => {
                console.error('WebSocket Error:', event);
            },
            onWebSocketClose: (event) => {
                console.log('WebSocket Closed:', event);
            }
        });

        this.stompClient.onConnect = () => {
            console.log('Successfully connected to WebSocket');
            this.subscribeToNotifications(userId);
        };

        this.stompClient.onStompError = (frame) => {
            console.error('STOMP error:', frame);
        };

        try {
            this.stompClient.activate();
            console.log('Attempting to connect to WebSocket...');
        } catch (error) {
            console.error('Error activating STOMP client:', error);
        }
    }

    subscribeToNotifications(userId) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        const destination = `/user/${userId}/queue/notifications`;
        console.log('Subscribing to notifications at:', destination);

        this.subscription = this.stompClient.subscribe(
            destination,
            (message) => {
                console.log('Raw notification message received:', message);
                console.log('Message headers:', message.headers);
                console.log('Message body:', message.body);

                try {
                    const notification = JSON.parse(message.body);
                    console.log('Parsed notification:', notification);
                    this.notifySubscribers(notification);
                } catch (error) {
                    console.error('Error parsing notification:', error);
                    console.error('Raw message body that failed to parse:', message.body);
                }
            }
        );

        console.log('Subscription completed for user:', userId);
    }

    addNotificationCallback(callback) {
        this.notificationCallbacks.add(callback);
    }

    removeNotificationCallback(callback) {
        this.notificationCallbacks.delete(callback);
    }

    notifySubscribers(notification) {
        console.log('Notifying subscribers with notification:', notification);
        this.notificationCallbacks.forEach(callback => {
            try {
                callback(notification);
            } catch (error) {
                console.error('Error in notification callback:', error);
            }
        });
    }

    disconnect() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.stompClient) {
            this.stompClient.deactivate();
        }
    }
}

export const notificationService = new NotificationService();
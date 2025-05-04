import { Avatar, Grid, IconButton, CircularProgress, Alert, Snackbar } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import WestIcon from '@mui/icons-material/West';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { getHistoyMessage, getUser, addMessage, resetUnreadMessages } from '../../Store/Chat/Action';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../../config/api';
import Stomp from 'stompjs';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchUsers } from '../../Store/Auth/Action';
import { handleNewMessage } from '../../Store/Notification/Action';
import { MessageSkeleton } from '../Common/LoadingStates';
import { useLoading } from '../../utils/LoadingContext';

function Message() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoading, hideLoading } = useLoading();

    const auth = useSelector(state => state.auth.user);
    const users = useSelector(state => state.chat.users);
    const searchResults = useSelector(state => state.auth.userSearch);
    const messages = useSelector(state => state.chat.messages);

    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [userId, setUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!auth) return;

        setIsConnecting(true);
        showLoading('Connecting to chat server...');
        const sock = new SockJS(`${API_BASE_URL}/ws`);
        const stomp = Stomp.over(sock);

        // Disable debug logging
        stomp.debug = null;

        const headers = {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
        };

        stomp.connect(headers,
            () => {
                console.log("WebSocket connected");
                setStompClient(stomp);
                setIsConnecting(false);
                setError('');
                hideLoading();
            },
            (error) => {
                console.error("WebSocket connection error:", error);
                setIsConnecting(false);
                setError('Không thể kết nối đến máy chủ chat');
                hideLoading();
            }
        );

        return () => {
            if (stomp?.connected) {
                stomp.disconnect();
            }
        };
    }, [auth, showLoading, hideLoading]);

    // Load users
    useEffect(() => {
        if (auth) {
            dispatch(getUser());
        }
    }, [dispatch, auth]);

    // Set first user as default when users are loaded
    useEffect(() => {
        if (users && users.length > 0 && !userId) {
            setUserId(users[0].id);
        }
    }, [users, userId]);

    // Load message history
    useEffect(() => {
        if (userId && auth) {
            setIsLoading(true);
            dispatch(getHistoyMessage(userId))
                .finally(() => setIsLoading(false));
        }
    }, [userId, dispatch, auth]);

    // Subscribe to private messages
    useEffect(() => {
        if (stompClient && auth && userId) {
            // Subscribe to private messages
            const subscription = stompClient.subscribe(
                `/user/${auth.id}/private`,
                (message) => {
                    const newMessage = JSON.parse(message.body);
                    dispatch(addMessage(newMessage, auth.id, location.pathname));

                    // if (!location.pathname.includes('/message')) {
                    //     dispatch(handleNewMessage(newMessage, location.pathname));
                    // }
                }
            );

            return () => subscription.unsubscribe();
        }
    }, [stompClient, auth, userId, dispatch, location.pathname]);

    useEffect(() => {
        if (userId && location.pathname.includes('/message')) {
            dispatch(resetUnreadMessages(userId));
        }
    }, [userId, location.pathname, dispatch]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!userId || !inputMessage.trim()) return;

        if (!stompClient?.connected) {
            setError('Mất kết nối đến máy chủ chat');
            return;
        }

        try {
            const messageData = {
                senderId: auth.id,
                receiverId: userId,
                content: inputMessage.trim(),
                timestamp: new Date().toISOString()
            };

            stompClient.send(
                `/app/chat/${auth.id}/${userId}`,
                {},
                JSON.stringify(messageData)
            );

            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Không thể gửi tin nhắn');
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim()) {
            dispatch(searchUsers(query));
        }
    };

    if (!auth) {
        return <div className="flex justify-center items-center h-screen">
            <Alert severity="error">Vui lòng đăng nhập để sử dụng tính năng chat</Alert>
        </div>;
    }

    return (
        <div>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Grid container className='h-screen overflow-hidden'>
                <Grid item xs={12} md={3} className='px-5 border-r'>
                    <div className='flex h-full flex-col'>
                        <div className='flex items-center space-x-4 py-5' onClick={() => navigate("/")}>
                            <WestIcon />
                            <h1 className='text-xl font-bold'>Trang chủ</h1>
                        </div>

                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Tìm kiếm người dùng..."
                                className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className='overflow-y-auto flex-1 hideScrollbar'>
                            {isConnecting ? (
                                <MessageSkeleton />
                            ) : searchQuery && searchResults?.length ? (
                                searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${userId === user.id ? 'bg-blue-50' : ''}`}
                                        onClick={() => setUserId(user.id)}
                                    >
                                        <Avatar src={user.image || "/default-avatar.png"} alt={user.fullName} />
                                        <p className="font-medium">{user.fullName}</p>
                                    </div>
                                ))
                            ) : users?.length ? (
                                users.map((user) => {
                                    const lastMessage = messages.find(msg =>
                                        (msg.senderId === user.id && msg.receiverId === auth.id) ||
                                        (msg.senderId === auth.id && msg.receiverId === user.id)
                                    );

                                    return (
                                        <div
                                            key={user.id}
                                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${userId === user.id ? 'bg-blue-50' : ''}`}
                                            onClick={() => setUserId(user.id)}
                                        >
                                            <Avatar src={user.image || "/default-avatar.png"} alt={user.fullName} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium">{user.fullName}</p>
                                                {lastMessage && (
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {lastMessage.senderId === auth.id ? "Bạn: " : ""}{lastMessage.content}
                                                    </p>
                                                )}
                                            </div>
                                            {user.unreadCount > 0 && (
                                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                    {user.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className='text-center text-gray-500 mt-4'>Không có người dùng nào</p>
                            )}
                        </div>
                    </div>
                </Grid>

                {/* Chat Section */}
                <Grid item xs={12} md={9} className='h-full'>
                    <div className='flex flex-col h-full'>
                        {/* Chat Header */}
                        <div className='flex justify-between items-center p-4 border-b'>
                            <div className='flex items-center space-x-3'>
                                <Avatar
                                    src={users.find(user => user.id === userId)?.image || "/default-avatar.png"}
                                    alt="avatar"
                                />
                                <p className="font-medium">
                                    {users.find(user => user.id === userId)?.fullName || "Chưa chọn người nhận"}
                                </p>
                            </div>
                            <div className='flex space-x-3'>
                                <IconButton><CallIcon /></IconButton>
                                <IconButton><VideocamIcon /></IconButton>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className='flex-1 overflow-y-auto hideScrollbar px-4 py-6'>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-full">
                                    <CircularProgress />
                                </div>
                            ) : messages?.length > 0 ? (
                                messages.map((message, index) => {
                                    const isSender = message.senderId === auth.id;
                                    return (
                                        <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
                                            <div className={`flex items-end space-x-2 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <Avatar
                                                    src={isSender ? auth.image || "/default-avatar.png" : users.find(u => u.id === message.senderId)?.image || "/default-avatar.png"}
                                                    alt={isSender ? "sender-avatar" : "receiver-avatar"}
                                                    sx={{ width: 32, height: 32 }}
                                                />
                                                <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                                                    <p className="break-words">{message.content}</p>
                                                    <span className={`text-xs ${isSender ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>
                                                        {new Date(message.timestamp).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <p>Chưa có tin nhắn nào.</p>
                                    {userId && <p className="mt-2">Hãy bắt đầu cuộc trò chuyện!</p>}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className='border-t p-4'>
                            <div className='flex items-center space-x-3'>
                                <input
                                    type="text"
                                    className='flex-1 border border-gray-300 rounded-full py-3 px-5 focus:outline-none focus:border-blue-500'
                                    placeholder='Nhập tin nhắn...'
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    disabled={!userId || isConnecting}
                                />
                                <IconButton
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || !userId || isConnecting}
                                    color="primary"
                                >
                                    <SendIcon />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Message;
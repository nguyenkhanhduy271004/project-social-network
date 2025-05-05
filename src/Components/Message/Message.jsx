import CallIcon from '@mui/icons-material/Call';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import WestIcon from '@mui/icons-material/West';
import { Alert, Avatar, CircularProgress, Grid, IconButton, Snackbar, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { API_BASE_URL } from '../../config/api';
import { findUserById, searchUsers } from '../../Store/Auth/Action';
import { addMessage, getHistoryMessage, getUser, resetUnreadMessages } from '../../Store/Chat/Action';
import { useLoading } from '../../utils/LoadingContext';
import { MessageSkeleton } from '../Common/LoadingStates';

function Message() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoading, hideLoading } = useLoading();

    const auth = useSelector(state => state.auth.user);
    const [users, setUsers] = useState(useSelector(state => state.chat.users) || []);
    const searchResults = useSelector(state => state.auth.userSearch);
    const messages = useSelector(state => state.chat.messages);
    const findUser = useSelector(state => state.auth.findUser);

    const loading = useSelector(state => state.chat.users);

    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [userId, setUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const queryParams = new URLSearchParams(location.search);
    const newUserId = queryParams.get("newChat");

    useEffect(() => {
        if (newUserId) {
            setUserId(newUserId);
            dispatch(findUserById(newUserId));
        }
    }, [newUserId, dispatch]);

    useEffect(() => {
        if (findUser?.id && !users.some(user => user.id === findUser.id)) {
            setUsers([...users, { id: findUser.id, fullName: findUser.fullName, image: findUser.image }]);
        }
    }, [findUser, users]);


    useEffect(() => {
        if (auth) {
            dispatch(getUser());
        }
    }, [dispatch, auth]);



    useEffect(() => {
        if (users?.length > 0 && !userId) {
            setUserId(users[0].id);
        }
    }, [users]);

    useEffect(() => {
        if (!auth) return;
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            setError('Không tìm thấy token xác thực');
            return;
        }

        setIsConnecting(true);
        showLoading('Connecting to chat server...');
        const sock = new SockJS(`${API_BASE_URL}/ws`);
        const stomp = Stomp.over(sock);
        if (process.env.NODE_ENV !== 'production') {
            stomp.debug = console.log;
        }

        const connect = (attempt = 1, maxAttempts = 3) => {
            stomp.connect(
                { Authorization: `Bearer ${jwt}` },
                () => {
                    setStompClient(stomp);
                    setIsConnecting(false);
                    setError('');
                    hideLoading();
                },
                (error) => {
                    if (attempt < maxAttempts) {
                        setTimeout(() => connect(attempt + 1, maxAttempts), 2000);
                    } else {
                        setIsConnecting(false);
                        setError('Không thể kết nối đến máy chủ chat');
                        hideLoading();
                    }
                }
            );
        };

        connect();

        return () => {
            if (stomp?.connected) {
                stomp.disconnect();
            }
        };
    }, [auth, showLoading, hideLoading]);

    useEffect(() => {
        if (userId && auth && !messages.some(msg => msg.receiverId === userId || msg.senderId === userId)) {
            setIsLoading(true);
            dispatch(getHistoryMessage(userId))
                .catch(() => setError('Không thể tải lịch sử tin nhắn'))
                .finally(() => setIsLoading(false));
        }
    }, [userId, auth, dispatch, messages]);

    useEffect(() => {
        if (stompClient?.connected && auth) {
            const subscription = stompClient.subscribe(
                `/user/${auth.id}/private`,
                (message) => {
                    const newMessage = JSON.parse(message.body);
                    dispatch(addMessage(newMessage, auth.id, location.pathname));
                }
            );
            return () => subscription.unsubscribe();
        }
    }, [stompClient, auth, dispatch, location.pathname]);

    useEffect(() => {
        if (userId && location.pathname.includes('/message')) {
            dispatch(resetUnreadMessages(userId));
        }
    }, [userId, location.pathname, dispatch]);

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
        return (
            <div className="flex justify-center items-center h-screen">
                <Alert severity="error">Vui lòng đăng nhập để sử dụng tính năng chat</Alert>
            </div>
        );
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
                                <p className='text-center text-gray-500 mt-4'>Không có người dùng nào. Hãy tìm kiếm để bắt đầu chat!</p>
                            )}
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12} md={9} className='h-full'>
                    <div className='flex flex-col h-full'>
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

                        <div className='border-t p-4'>
                            <div className='flex items-center space-x-3'>
                                <Tooltip title={isConnecting ? 'Đang kết nối...' : !userId ? 'Vui lòng chọn người nhận' : ''}>
                                    <span style={{ width: '100%' }} className={`flex items-center ${isConnecting || !userId ? 'pointer-events-none' : ''}`}>
                                        <input
                                            type="text"
                                            className='flex-1 border border-gray-300 rounded-full py-3 px-5 focus:outline-none focus:border-blue-500'
                                            placeholder='Nhập tin nhắn...'
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            disabled={!userId || isConnecting}
                                        />
                                    </span>
                                </Tooltip>
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
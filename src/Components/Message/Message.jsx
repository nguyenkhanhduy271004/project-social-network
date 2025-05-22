import CallIcon from '@mui/icons-material/Call';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import WestIcon from '@mui/icons-material/West';
import { Alert, Avatar, CircularProgress, Grid, IconButton, Snackbar, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { API_BASE_URL } from '../../config/api';
import { findUserById, searchUsers } from '../../Store/Auth/Action';
import { addMessage, getHistoryMessage, getUser, resetUnreadMessages } from '../../Store/Chat/Action';
import { useLoading } from '../../utils/LoadingContext';
import { MessageSkeleton } from '../Common/LoadingStates';
import debounce from 'lodash/debounce';

const UserListItem = React.memo(({ user, isSelected, lastMessage, unreadCount, onSelect, currentUserId }) => (
    <div
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
        onClick={() => onSelect(user.id)}
    >
        <Avatar src={user.image || "/default-avatar.png"} alt={user.fullName} />
        <div className="flex-1 min-w-0">
            <p className="font-medium">{user.fullName}</p>
            {lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                    {lastMessage.senderId === currentUserId ? "Bạn: " : ""}{lastMessage.content}
                </p>
            )}
        </div>
        {unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
            </span>
        )}
    </div>
));

const MessageItem = React.memo(({ message, isSender, senderImage, receiverImage }) => (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-end space-x-2 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar
                src={isSender ? senderImage : receiverImage}
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
));

function Message() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoading, hideLoading } = useLoading();

    const auth = useSelector(state => state.auth.user);
    const chatUsers = useSelector(state => state.chat.users) || [];
    const searchResults = useSelector(state => state.auth.userSearch) || [];
    const messages = useSelector(state => state.chat.messages) || [];
    const findUser = useSelector(state => state.auth.findUser);

    const [users, setUsers] = useState(Array.isArray(chatUsers) ? chatUsers : []);
    const [inputMessage, setInputMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 5000;

    const stompRef = useRef(null);
    const subscriptionRef = useRef(null);
    const messagesEndRef = useRef(null);
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const newUserId = queryParams.get("newChat");

    useEffect(() => {
        setUsers(Array.isArray(chatUsers) ? chatUsers : []);
    }, [chatUsers]);

    const setupWebSocket = useCallback(() => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) return;

        try {
            const sock = new SockJS(`${API_BASE_URL}/ws`);
            const stomp = Stomp.over(sock);
            stompRef.current = stomp;

            stomp.connect(
                { Authorization: `Bearer ${jwt}` },
                () => {
                    subscribeToMessages();
                },
                (error) => {
                    console.error('WebSocket connection error:', error);
                }
            );
        } catch (error) {
            console.error('WebSocket setup error:', error);
        }
    }, []);

    const subscribeToMessages = useCallback(() => {
        if (!stompRef.current?.connected || !auth?.id) return;

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = stompRef.current.subscribe(
            `/user/${auth.id}/private`,
            (message) => {
                try {
                    const newMessage = JSON.parse(message.body);
                    if (newMessage.senderId !== auth.id) {
                        dispatch(addMessage(newMessage, auth.id, location.pathname));
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
        );
    }, [auth?.id, dispatch, location.pathname]);

    useEffect(() => {
        setupWebSocket();
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
            if (stompRef.current?.connected) {
                stompRef.current.disconnect();
            }
        };
    }, [setupWebSocket]);

    const handleSendMessage = useCallback(() => {
        if (!userId || !inputMessage.trim()) {
            return;
        }

        if (!stompRef.current?.connected) {
            setError('Mất kết nối đến máy chủ chat. Đang thử kết nối lại...');
            setupWebSocket();
            return;
        }

        try {
            const messageData = {
                senderId: auth.id,
                receiverId: userId,
                content: inputMessage.trim(),
                timestamp: new Date().toISOString()
            };

            stompRef.current.send(
                `/app/chat/${auth.id}/${userId}`,
                {},
                JSON.stringify(messageData)
            );

            dispatch(addMessage(messageData, auth.id, location.pathname));
            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
        }
    }, [userId, inputMessage, auth.id, dispatch, location.pathname, setupWebSocket]);

    const debouncedSearch = useMemo(
        () => debounce((query) => {
            if (query.trim()) {
                dispatch(searchUsers(query));
            }
        }, 300),
        [dispatch]
    );

    const handleSearchChange = useCallback((e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    }, [debouncedSearch]);

    const filteredMessages = useMemo(() => {
        if (!userId) return [];
        return messages.filter(msg =>
            (msg.senderId === userId && msg.receiverId === auth.id) ||
            (msg.senderId === auth.id && msg.receiverId === userId)
        );
    }, [messages, userId, auth.id]);

    const userList = useMemo(() => {
        if (searchQuery && searchResults?.length) {
            return searchResults;
        }
        return users;
    }, [searchQuery, searchResults, users]);

    useEffect(() => {
        if (newUserId) {
            setUserId(newUserId);
            dispatch(findUserById(newUserId));
        }
    }, [newUserId, dispatch]);

    useEffect(() => {
        if (findUser?.id && !users.some(user => user.id === findUser.id)) {
            setUsers(prev => [...prev, {
                id: findUser.id,
                fullName: findUser.fullName,
                image: findUser.image
            }]);
        }
    }, [findUser, users]);

    useEffect(() => {
        if (auth?.id) {
            dispatch(getUser())
                .catch(error => {
                    console.error('Error fetching users:', error);
                    setError('Không thể tải danh sách người dùng');
                });
        }
    }, [auth?.id, dispatch]);

    useEffect(() => {
        if (users?.length > 0 && !userId && !newUserId) {
            setUserId(users[0].id);
        }
    }, [users, userId, newUserId]);

    useEffect(() => {
        if (userId && auth?.id && !messages.some(msg =>
            msg.receiverId === userId || msg.senderId === userId
        )) {
            setIsLoading(true);
            dispatch(getHistoryMessage(userId))
                .catch(() => setError('Không thể tải lịch sử tin nhắn'))
                .finally(() => setIsLoading(false));
        }
    }, [userId, auth?.id, dispatch, messages]);

    useEffect(() => {
        if (userId && location.pathname.includes('/message')) {
            dispatch(resetUnreadMessages(userId));
        }
    }, [userId, location.pathname, dispatch]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [filteredMessages]);

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
                                style={{ color: 'white' }}
                            />
                        </div>

                        <div className='overflow-y-auto flex-1 hideScrollbar'>
                            {isConnecting && !userList.length ? (
                                <MessageSkeleton />
                            ) : userList?.length ? (
                                userList.map((user) => {
                                    const lastMessage = messages
                                        .filter(msg =>
                                            (msg.senderId === user.id && msg.receiverId === auth.id) ||
                                            (msg.senderId === auth.id && msg.receiverId === user.id)
                                        )
                                        .slice(-1)[0];
                                    return (
                                        <UserListItem
                                            key={user.id}
                                            user={user}
                                            isSelected={userId === user.id}
                                            lastMessage={lastMessage}
                                            unreadCount={user.unreadCount || 0}
                                            onSelect={setUserId}
                                            currentUserId={auth.id}
                                        />
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
                            ) : filteredMessages.length > 0 ? (
                                filteredMessages.map((message, index) => (
                                    <MessageItem
                                        key={`${message.timestamp}-${index}`}
                                        message={message}
                                        isSender={message.senderId === auth.id}
                                        senderImage={auth.image || "/default-avatar.png"}
                                        receiverImage={users.find(u => u.id === userId)?.image || "/default-avatar.png"}
                                    />
                                ))
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
                                    <span className={`flex items-center ${isConnecting || !userId ? 'pointer-events-none' : ''}`}>
                                        <input
                                            type="text"
                                            className='flex-1 border border-gray-300 rounded-full py-3 px-5 focus:outline-none focus:border-blue-500'
                                            placeholder='Nhập tin nhắn...'
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            disabled={!userId || isConnecting}
                                            style={{ color: 'black' }}
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

export default React.memo(Message);
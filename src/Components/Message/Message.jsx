import { Avatar, Grid, IconButton } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import WestIcon from '@mui/icons-material/West';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { getHistoyMessage, getUser, sendMessage } from '../../Store/Chat/Action';
import SearchUser from '../SearchUser/SearchUser';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../../config/api';
import Stomp from 'stompjs';
import { useNavigate } from 'react-router-dom';

function Message() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth.user);
    const users = useSelector(state => state.chat.users);
    const messages = useSelector(state => state.chat.messages);

    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [userId, setUserId] = useState(null);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        if (userId) {
            dispatch(getHistoyMessage(userId));
        }
    }, [userId, dispatch]);

    useEffect(() => {
        const sock = new SockJS(`${API_BASE_URL}/ws`);
        const stomp = Stomp.over(sock);

        stomp.connect({}, () => {
            console.log("WebSocket connected");
            setStompClient(stomp);
        }, (error) => {
            console.error("WebSocket connection error:", error);
        });

        return () => {
            if (stomp.connected) {
                stomp.disconnect(() => console.log("WebSocket disconnected"));
            }
        };
    }, []);

    useEffect(() => {
        if (stompClient && auth && userId) {
            const roomId = auth.id + userId;
            const subscription = stompClient.subscribe(`/user/${roomId}/private`, (message) => {
                const newMessage = JSON.parse(message.body);
                // console.log("📩 Tin nhắn nhận được:", newMessage);
            });

            return () => subscription.unsubscribe();
        }
    }, [stompClient, auth, userId, dispatch]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!userId) {
            alert("Vui lòng chọn người dùng để gửi tin nhắn")
        }
        if (!stompClient || !stompClient.connected || !inputMessage.trim()) {
            console.warn("Không thể gửi tin nhắn: WebSocket chưa kết nối hoặc tin nhắn rỗng!");
            return;
        }
        console.log(userId);
        const messageData = { senderId: auth.id, receiverId: userId, content: inputMessage, timestamp: new Date().toISOString() };
        const roomId = auth.id + userId;
        stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(messageData));
        dispatch(sendMessage({ receiverId: userId, content: inputMessage }));
        setInputMessage('');
    };

    return (
        <div>
            <Grid container className='h-screen overflow-hidden'>
                <Grid item xs={3} className='px-5'>
                    <div className='flex h-full flex-col'>
                        <div className='flex items-center space-x-4 py-5' onClick={() => navigate("/")}>
                            <WestIcon />
                            <h1 className='text-xl font-bold'>Trang chủ</h1>
                        </div>
                        <SearchUser />
                        <div className='overflow-y-auto flex-1 hideScrollbar'>
                            {users?.length ? users.map((user) => (
                                <div key={user.id} className="flex items-center space-x-3 p-3 border-b cursor-pointer hover:bg-gray-200"
                                    onClick={() => setUserId(user.id)}>
                                    <Avatar src={user.image || "https://cdn-icons-png.flaticon.com/512/8345/8345328.png"} alt={user.fullName} />
                                    <p>{user.fullName}</p>
                                </div>
                            )) : (
                                <p className='text-center text-gray-500'>Không có người dùng nào</p>
                            )}
                        </div>
                    </div>
                </Grid>

                <Grid item xs={9} className='h-full border-l'>
                    <div className='flex justify-between items-center p-5'>
                        <div className='flex items-center space-x-3'>
                            <Avatar src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png" alt="avatar" />
                            <p>{users.find(user => user.id === userId)?.fullName || "Chưa chọn người nhận"}</p>
                        </div>
                        <div className='flex space-x-3'>
                            <IconButton><CallIcon /></IconButton>
                            <IconButton><VideocamIcon /></IconButton>
                        </div>
                    </div>

                    <div className='hideScrollbar overflow-y-scroll h-[82vh] px-2 space-y-5 py-10'>
                        {messages?.length > 0 ? (
                            messages.map((message, index) => {
                                const isSender = message.senderId === auth.id || message.receiverId !== auth.id;
                                return (
                                    <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'} space-x-3 py-2`}>
                                        {!isSender && <Avatar src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png" alt="receiver-avatar" />}
                                        <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                            <p>{message.content}</p>
                                            <span className='text-xs text-gray-500'>
                                                {message.timestamp && !isNaN(new Date(message.timestamp).getTime())
                                                    ? new Date(message.timestamp).toLocaleTimeString()
                                                    : "Không xác định"}
                                            </span>
                                        </div>
                                        {isSender && <Avatar src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png" alt="sender-avatar" />}
                                    </div>
                                );
                            })
                        ) : (
                            <p className='text-center text-gray-500'>Chưa có tin nhắn nào.</p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className='sticky bottom-0 border-t py-5 flex items-center px-5 space-x-3'>
                        <input
                            type="text"
                            className='flex-1 bg-transparent border border-gray-400 rounded-full py-3 px-5'
                            placeholder='Nhập tin nhắn...'
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <IconButton onClick={handleSendMessage}><SendIcon /></IconButton>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Message;

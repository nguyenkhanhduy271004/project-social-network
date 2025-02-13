import { Avatar, Grid, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import WestIcon from '@mui/icons-material/West';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import { getHistoyMessage, sendMessage } from '../../Store/Chat/Action';
import SearchUser from '../SearchUser/SearchUser';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../../config/api';
import Stomp from 'stompjs';

function Message() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth.user);
    const loading = useSelector((store) => store.chat.loading);
    const [messages, setMessages] = useState(useSelector(store => store.chat.messages) || []);
    const [inputMessage, setInputMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        dispatch(getHistoyMessage(auth.id === 1 ? 2 : 1));
    }, []);

    useEffect(() => {
        const sock = new SockJS(`${API_BASE_URL}/ws`);
        const stomp = Stomp.over(sock);

        stomp.connect({}, () => {
            console.log("✅ WebSocket connected");
            setStompClient(stomp);
        }, (error) => {
            console.error("❌ WebSocket connection error:", error);
        });

        return () => {
            if (stomp && stomp.connected) {
                stomp.disconnect(() => console.log("🔌 WebSocket disconnected"));
            }
        };
    }, []);

    useEffect(() => {
        if (stompClient && auth) {
            const subscription = stompClient.subscribe(`/user/${auth.id}/private`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => subscription.unsubscribe();
        }
    }, [stompClient, auth]);


    if (loading) {
        return <h1 className="text-center text-gray-500">Đang tải tin nhắn...</h1>;
    }

    const handleSendMessage = () => {
        if (!stompClient || !stompClient.connected) {
            console.warn("⚠️ Không thể gửi tin nhắn: WebSocket chưa kết nối!");
            return;
        }

        if (inputMessage.trim() !== '') {
            const messageData = { senderId: auth.id, receiverId: 2, content: inputMessage, timestamp: new Date().toISOString() };
            stompClient.send(`/app/chat/${2}`, {}, JSON.stringify(messageData));
            setMessages((prevMessages) => [...prevMessages, messageData]);
            dispatch(sendMessage({ receiverId: auth.id === 1 ? 2 : 1, content: inputMessage }))
            setInputMessage('');
        }
    };

    return (
        <div>
            <Grid container className='h-screen overflow-y-hidden'>
                <Grid item xs={3} className='px-5'>
                    <div className='flex h-full justify-between space-x-2'>
                        <div className='w-full'>
                            <div className='flex space-x-4 items-center py-5'>
                                <WestIcon />
                                <h1 className='text-xl font-bold'>Trang chủ</h1>
                            </div>
                            <div className='h-[83vh]'>
                                <SearchUser />
                                <div className='h-full space-y-4 mt-5 overflow-y-auto hideScrollbar'></div>
                            </div>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={9} className='h-full'>
                    <div className='flex justify-between items-center border-l p-5'>
                        <div className='flex items-center space-x-3'>
                            <Avatar src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png" alt="avatar" />
                            <p>Nguyễn Khánh Duy</p>
                        </div>
                        <div className='flex space-x-3'>
                            <IconButton><CallIcon /></IconButton>
                            <IconButton><VideocamIcon /></IconButton>
                        </div>
                    </div>

                    <div className='hideScrollbar overflow-y-scroll h-[82vh] px-2 space-y-5 py-5'>
                        {messages && messages.length > 0 ? (
                            messages.map((message, index) => {
                                const isSender = message.senderId === auth.id;
                                return (
                                    <div key={index} className={`flex ${isSender ? 'justify-end' : 'justify-start'} space-x-3 py-2`}>
                                        {!isSender && (
                                            <Avatar src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png" alt="receiver-avatar" />
                                        )}
                                        <div className={`max-w-[70%] px-4 py-2 rounded-lg ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                            <p>{message.content}</p>
                                            <span className='text-xs text-black'>{new Date(message.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                        {isSender && (
                                            <Avatar src="https://cdn-icons-png.flaticon.com/512/8345/8345328.png" alt="sender-avatar" />
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className='text-center text-gray-500'>Chưa có tin nhắn nào.</p>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className='sticky bottom-0 border-1'>
                        <div className='py-5 flex items-center justify-center space-x-5'>
                            <input
                                type="text"
                                className='bg-transparent border border-[#3b40544] rounded-full w-[90%] py-3 px-5'
                                placeholder='Nhập tin nhắn...'
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                            />
                            <IconButton onClick={handleSendMessage}><SendIcon /></IconButton>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default Message;

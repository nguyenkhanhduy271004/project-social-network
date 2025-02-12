import { Avatar, Divider, Grid, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import WestIcon from '@mui/icons-material/West';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SearchUser from '../SearchUser/SearchUser';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { API_BASE_URL } from '../../config/api';

function Message() {
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const sock = new SockJS(`${API_BASE_URL}/ws`);
        const stomp = Stomp.over(sock);
        setStompClient(stomp);

        stomp.connect({}, onConnect, onErr);
    }, [])

    const onConnect = () => {
        console.log("websocket connected...")
    }

    const onErr = (error) => {
        console.log("error: ", error)
    }
    const users = [
        { id: 1, name: 'Nguyễn Khánh Duy', avatar: 'https://cdn-icons-png.flaticon.com/512/8345/8345328.png' },
        { id: 2, name: 'Trần Minh Tú', avatar: 'https://cdn-icons-png.flaticon.com/512/8345/8345328.png' },
        { id: 3, name: 'Lê Hoàng Nam', avatar: 'https://cdn-icons-png.flaticon.com/512/8345/8345328.png' },
    ];
    const messages = [
        { id: 1, sender: 1, content: 'Chào bạn!', time: '08:00 AM' },
        { id: 2, sender: 2, content: 'Chào bạn, bạn khỏe không?', time: '08:05 AM' },
        { id: 3, sender: 1, content: 'Mình khỏe, cảm ơn bạn!', time: '08:10 AM' },
        { id: 4, sender: 2, content: 'Tốt quá, mình cũng vậy!', time: '08:15 AM' },
    ];
    const handleSelectedImage = () => {

    }
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
                                <div className=''>
                                    <SearchUser />
                                </div>
                                <div className='h-full space-y-4 mt-5 overflow-y-auto hideScrollbar'>
                                    {users.map(user => (
                                        <div>
                                            <div key={user.id} className="flex items-center space-x-3 py-2 px-3 hover:bg-gray-200 cursor-pointer">
                                                <Avatar src={user.avatar} alt={user.name} />
                                                <p className="font-semibold">{user.name}</p>
                                            </div>
                                            <Divider className='ms-4 me-2' />
                                        </div>
                                    ))}
                                </div>
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
                            <IconButton>
                                <CallIcon />
                            </IconButton>
                            <IconButton>
                                <VideocamIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className='hideScrollbar overflow-y-scroll h-[82vh] px-2 space-y-5 py-5'>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 1 ? 'justify-start' : 'justify-end'} space-x-3 py-2`}
                            >
                                <Avatar
                                    src={message.sender === 1 ? users[0].avatar : users[1].avatar}
                                    alt={message.sender === 1 ? users[0].name : users[1].name}
                                />
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-lg ${message.sender === 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-black'
                                        }`}
                                >
                                    <p>{message.content}</p>
                                    <span className='text-xs text-black'>{message.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='sticky bottom-0 border-1'>
                        <div className='py-5 flex items-center justify-center space-x-5'>
                            <input type="text" className='bg-transparent border border-[#3b40544] rounded-full w-[90%] py-3 px-5' placeholder='Nhập tin nhắn...' />
                            <div>
                                <input type="file" accept='image*/' onChange={handleSelectedImage} className='hidden' id='image-input' />
                                <label htmlFor="image-input">
                                    <AddPhotoAlternateIcon />
                                </label>
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Message

import React, { useEffect, useState } from 'react';
import { Avatar, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, getRandomUser } from '../../Store/Auth/Action';

function RightPart() {
    const user = useSelector(store => store.auth.user);
    const users = useSelector(store => store.auth.users);

    const [change, setChange] = useState(false);

    const dispatch = useDispatch();

    const handleChangeTheme = () => {
        console.log("handle change theme");
    }

    const handleFollowUser = (userId) => {
        dispatch(followUser(userId));
        setChange(!change);
    }

    useEffect(() => {
        dispatch(getRandomUser());
    }, [change])

    return (
        <div className="container bg-white text-black py-5 px-4 rounded-lg">
            <div className="profile flex items-center mb-5">
                <Avatar
                    alt="Profile picture"
                    src={user.image ? user.image : "https://cdn-icons-png.flaticon.com/512/8345/8345328.png"}
                    sx={{ width: 50, height: 50, marginRight: '10px' }}
                />
                <div className="profile-info flex-grow">
                    <h2 className="text-sm font-semibold">@{user.email.split('@')[0]}</h2>
                    <p className="text-xs text-gray-600">{user.fullName}</p>
                </div>
                <div className="profile-action text-blue-500 text-sm cursor-pointer">Chuyển</div>
            </div>

            <div className="suggestions mb-5">
                <div className="suggestions-header flex justify-between items-center mb-3">
                    <h3 className="text-sm text-gray-600">Gợi ý cho bạn</h3>
                    <a href="#" className="text-sm text-blue-500">Xem tất cả</a>
                </div>

                {Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => {
                        const username = user.fullName ? user.fullName.replace(/\s+/g, "_").toLowerCase() : "unknown_user";
                        return (
                            <div className="suggestion flex items-center mb-4" key={user.id}>
                                <Avatar
                                    alt="Suggested user"
                                    src={user.image || "https://storage.googleapis.com/a1aa/image/default.jpg"}
                                    sx={{ width: 40, height: 40, marginRight: '10px' }}
                                />
                                <div className="suggestion-info flex-grow">
                                    <h4 className="text-sm font-semibold">@{username}</h4>
                                    <p className="text-xs text-gray-600">Gợi ý cho bạn</p>
                                </div>
                                <div className="suggestion-action text-blue-500 text-sm cursor-pointer" onClick={() => handleFollowUser(user.id)}>Theo dõi</div>
                            </div>
                        );
                    })
                ) : (
                    <p></p>
                )}
            </div>

            <div className="footer text-xs text-center text-gray-600 mt-5">
                <p>Giới thiệu · Trợ giúp · Báo chí · API · Việc làm · Quyền riêng tư · Điều khoản · Vị trí · Ngôn ngữ · Meta đã xác minh</p>
                <p>© 2025 INSTAGRAM FROM META</p>
            </div>
        </div>
    );
}

export default RightPart;

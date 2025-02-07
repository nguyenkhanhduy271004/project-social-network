import React from 'react';
import { Avatar, Button } from '@mui/material';

function RightPart() {
    const handleChangeTheme = () => {
        console.log("handle change theme");
    }

    return (
        <div className="container bg-white text-black py-5 px-4 rounded-lg">
            <div className="profile flex items-center mb-5">
                <Avatar
                    alt="Profile picture"
                    src="https://storage.googleapis.com/a1aa/image/8lsy6wPPPYEctOVekg47pH5njAB5nQ40kpPRl5IzQcw.jpg"
                    sx={{ width: 50, height: 50, marginRight: '10px' }}
                />
                <div className="profile-info flex-grow">
                    <h2 className="text-sm font-semibold">khasnhduyyaka</h2>
                    <p className="text-xs text-gray-600">Nguyễn Duy</p>
                </div>
                <div className="profile-action text-blue-500 text-sm cursor-pointer">Chuyển</div>
            </div>

            <div className="suggestions mb-5">
                <div className="suggestions-header flex justify-between items-center mb-3">
                    <h3 className="text-sm text-gray-600">Gợi ý cho bạn</h3>
                    <a href="#" className="text-sm text-blue-500">Xem tất cả</a>
                </div>

                {[1, 2, 3, 4].map((item, index) => (
                    <div className="suggestion flex items-center mb-4" key={index}>
                        <Avatar
                            alt="Suggested user"
                            src={`https://storage.googleapis.com/a1aa/image/aKnC8zAkJ0StqlJerIFNElIU8BC-JvYW_KK-5aKowlc.jpg`}
                            sx={{ width: 40, height: 40, marginRight: '10px' }}
                        />
                        <div className="suggestion-info flex-grow">
                            <h4 className="text-sm font-semibold">ph_anh.20</h4>
                            <p className="text-xs text-gray-600">Gợi ý cho bạn</p>
                        </div>
                        <div className="suggestion-action text-blue-500 text-sm cursor-pointer">Theo dõi</div>
                    </div>
                ))}
            </div>

            <div className="footer text-xs text-center text-gray-600 mt-5">
                <p>Giới thiệu · Trợ giúp · Báo chí · API · Việc làm · Quyền riêng tư · Điều khoản · Vị trí · Ngôn ngữ · Meta đã xác minh</p>
                <p>© 2025 INSTAGRAM FROM META</p>
            </div>
        </div>
    );
}

export default RightPart;

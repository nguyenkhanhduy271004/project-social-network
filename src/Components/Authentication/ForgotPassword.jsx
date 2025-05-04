import { useState, useEffect } from "react";
import axios from "axios";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const [timer, setTimer] = useState(300);

    const handleSendOTP = async () => {
        try {
            const res = await axios.post("http://localhost:8080/auth/forgot-password", new URLSearchParams({ email }));
            setMessage(res.data);
            setStep(2);
            setTimer(300);
        } catch (error) {
            setMessage(error.response?.data?.error || "Lỗi! Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, timer]);

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu không khớp!");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8080/auth/reset-password", new URLSearchParams({ email, otp: otp.join(""), newPassword }));
            setMessage(res.data);
            setStep(3);
        } catch (error) {
            setMessage(error.response?.data || "Lỗi! Vui lòng thử lại.");
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== "" && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-xl font-semibold text-center text-gray-700">{step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}</h2>
                {message && <p className={`mb-4 text-center ${step === 3 ? "text-green-600" : "text-red-500"}`}>{message}</p>}
                {step === 1 && (
                    <>
                        <input type="email" placeholder="Nhập email của bạn" className="w-full px-4 py-2 mb-4 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button onClick={handleSendOTP} className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">Gửi OTP</button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <p className="mb-2 text-center text-gray-600">OTP hết hạn sau: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</p>
                        <div className="flex justify-center space-x-2 mb-4">
                            {otp.map((num, index) => (
                                <input key={index} id={`otp-${index}`} type="text" className="w-12 h-12 text-center border rounded-lg" value={num} maxLength="1" onChange={(e) => handleOtpChange(index, e.target.value)} />
                            ))}
                        </div>
                        <input type="password" placeholder="Nhập mật khẩu mới" className="w-full px-4 py-2 mb-4 border rounded-lg" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <input type="password" placeholder="Xác nhận mật khẩu mới" className="w-full px-4 py-2 mb-4 border rounded-lg" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button onClick={handleResetPassword} className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600">Đặt lại mật khẩu</button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <p className="text-center text-green-600">Mật khẩu đã được cập nhật thành công!</p>
                        <div className="mt-4 text-center">
                            <a href="/login" className="text-blue-500 hover:underline">Quay lại đăng nhập</a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

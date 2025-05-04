import React, { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, Button, Divider, Link, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginUser, registerUser } from "../../Store/Auth/Action";
import GoogleLogin from "./GoogleLogin";
import { postLoginToken } from "../../api/postLoginToken";

function Authentication() {
    const [isLogin, setIsLogin] = useState(true);
    const { token, error, loading } = useSelector((state) => state.auth);
    const [user, setUser] = useState(null);
    const [socialError, setSocialError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const path = window.location.pathname;
        setIsLogin(path === "/login");
    }, []);

    useEffect(() => {
        if (token) {
            // dispatch(fetchUser(token));
        }
    }, [token, dispatch]);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Email không hợp lệ").required("Bắt buộc nhập email"),
        password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Bắt buộc nhập mật khẩu"),
        fullName: isLogin ? Yup.string() : Yup.string().required("Bắt buộc nhập tên đầy đủ"),
        date: isLogin ? Yup.string() : Yup.string().required("Chọn ngày"),
        month: isLogin ? Yup.string() : Yup.string().required("Chọn tháng"),
        year: isLogin ? Yup.string() : Yup.string().required("Chọn năm"),
    });

    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            date: "",
            month: "",
            year: "",
        },
        validationSchema,
        onSubmit: (values) => {
            if (isLogin) {
                dispatch(loginUser({ email: values.email, password: values.password }));
            } else {
                const birthDate = `${values.date}/${values.month}/${values.year}`;
                dispatch(registerUser({
                    email: values.email,
                    password: values.password,
                    fullName: values.fullName,
                    birthDate: birthDate,
                }));
            }
        },
    });

    const handleSocialLogin = async (loginType) => {
        try {
            const response = await axios.get('http://localhost:8080/auth/social-login', {
                params: { login_type: loginType },
            });
            window.location.href = response.data;
        } catch (error) {
            setSocialError(error.response?.data?.error || 'Lỗi khi lấy URL xác thực');
        }
    };

    const onGoogleSignIn = async res => {
        try {
            const { credential } = res;
            if (!credential) {
                console.error("No credential received from Google");
                return;
            }

            const result = await postLoginToken(credential, setIsLogin);

            if (result) {
                // Successfully logged in, refresh user data
                // You may want to redirect the user or update the UI
                window.location.href = "/"; // Redirect to home page
            }
        } catch (error) {
            console.error("Google Sign-In error:", error);
            setSocialError("An error occurred during Google Sign-In. Please try again.");
        }
    };

    return (
        <Container maxWidth={false} sx={{ width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "black" }}>
            <Box sx={{ width: "100%", maxWidth: 400, textAlign: "center", p: 3, bgcolor: "black", color: "white", borderRadius: 2, boxShadow: 3, border: "1px solid #ccc", marginTop: "20px" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Instagram
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {isLogin ? "Đăng nhập vào tài khoản của bạn." : "Đăng ký để xem ảnh và video từ bạn bè."}
                </Typography>
                {user ? (
                    <Box>
                        <Typography variant="h6">Chào mừng, {user.name}!</Typography>
                        <Typography>Email: {user.email}</Typography>
                        {user.birthDate && <Typography>Ngày sinh: {user.birthDate}</Typography>}
                        <Typography>JWT: {token}</Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2, bgcolor: "#1877F2" }}
                            onClick={() => {
                                setUser(null);
                                localStorage.removeItem("token");
                                dispatch({ type: "auth/logout" });
                            }}
                        >
                            Đăng xuất
                        </Button>
                    </Box>
                ) : (
                    <>
                        <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="Đăng nhập bằng google" />
                        {/* <Button
                            fullWidth
                            variant="contained"
                            sx={{ bgcolor: "#1877F2", color: "white", mb: 2 }}
                            onClick={() => handleSocialLogin("facebook")}
                        >
                            Đăng nhập bằng Facebook
                        </Button> */}
                        <Divider sx={{ my: 2 }}>HOẶC</Divider>
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                        {socialError && <Typography color="error" sx={{ mt: 2 }}>{socialError}</Typography>}
                        {loading && <Typography sx={{ mt: 2 }}>Đang xử lý...</Typography>}
                        <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                            {!isLogin && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Tên đầy đủ"
                                        variant="filled"
                                        name="fullName"
                                        value={formik.values.fullName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                        helperText={formik.touched.fullName && formik.errors.fullName}
                                        sx={{ mb: 2, bgcolor: "#333" }}
                                        InputLabelProps={{ style: { color: "white" } }}
                                    />
                                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                                        <FormControl fullWidth variant="filled" sx={{ bgcolor: "#333" }}>
                                            <InputLabel sx={{ color: "white" }}>Ngày</InputLabel>
                                            <Select
                                                name="date"
                                                value={formik.values.date}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.date && Boolean(formik.errors.date)}
                                                sx={{ color: "white" }}
                                            >
                                                {days.map((d) => (
                                                    <MenuItem key={d} value={d}>{d}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth variant="filled" sx={{ bgcolor: "#333" }}>
                                            <InputLabel sx={{ color: "white" }}>Tháng</InputLabel>
                                            <Select
                                                name="month"
                                                value={formik.values.month}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.month && Boolean(formik.errors.month)}
                                                sx={{ color: "white" }}
                                            >
                                                {months.map((m) => (
                                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth variant="filled" sx={{ bgcolor: "#333" }}>
                                            <InputLabel sx={{ color: "white" }}>Năm</InputLabel>
                                            <Select
                                                name="year"
                                                value={formik.values.year}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.year && Boolean(formik.errors.year)}
                                                sx={{ color: "white" }}
                                            >
                                                {years.map((y) => (
                                                    <MenuItem key={y} value={y}>{y}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </>
                            )}
                            <TextField
                                fullWidth
                                label="Email"
                                variant="filled"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                sx={{ mt: 2, bgcolor: "#333", "& .MuiInputLabel-root": { color: "white" }, "& .MuiFilledInput-root": { color: "white" } }}
                            />
                            <TextField
                                fullWidth
                                label="Mật khẩu"
                                type="password"
                                variant="filled"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                sx={{ mt: 2, bgcolor: "#333", "& .MuiInputLabel-root": { color: "white" }, "& .MuiFilledInput-root": { color: "white" } }}
                            />
                            <Button fullWidth type="submit" variant="contained" sx={{ mt: 2, bgcolor: "#1877F2", color: "white" }}>
                                {isLogin ? "Đăng nhập" : "Đăng ký"}
                            </Button>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            {isLogin ? (
                                <>
                                    Bạn chưa có tài khoản? <Link href="/signup" color="primary">Đăng ký</Link>
                                    <br />
                                    <Link href="/forgot-password" color="primary" sx={{ mt: 1, display: "block" }}>
                                        Quên mật khẩu?
                                    </Link>
                                </>
                            ) : (
                                <>Bạn có tài khoản? <Link href="/login" color="primary">Đăng nhập</Link></>
                            )}
                        </Typography>
                    </>
                )}
            </Box>
        </Container>
    );
}

export default Authentication;
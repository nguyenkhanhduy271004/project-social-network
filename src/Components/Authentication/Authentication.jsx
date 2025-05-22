import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, Box, Typography, TextField, Button, Divider, Link, MenuItem, Select, FormControl, InputLabel, CircularProgress, Fade, Grow } from "@mui/material";
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

    const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
    const years = useMemo(() => Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i), []);

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

    const handleSocialLogin = useCallback(async (loginType) => {
        try {
            const response = await axios.get('http://localhost:8080/auth/social-login', {
                params: { login_type: loginType },
            });
            window.location.href = response.data;
        } catch (error) {
            setSocialError(error.response?.data?.error || 'Lỗi khi lấy URL xác thực');
        }
    }, []);

    const onGoogleSignIn = useCallback(async res => {
        try {
            const { credential } = res;
            if (!credential) {
                console.error("No credential received from Google");
                return;
            }

            const result = await postLoginToken(credential, setIsLogin);

            if (result) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Google Sign-In error:", error);
            setSocialError("An error occurred during Google Sign-In. Please try again.");
        }
    }, []);

    return (
        <Container maxWidth={false} sx={{
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            bgcolor: "black",
            background: "linear-gradient(45deg, #000000 30%, #1a1a1a 90%)"
        }}>
            <Grow in={true} timeout={500}>
                <Box sx={{
                    width: "100%",
                    maxWidth: 400,
                    textAlign: "center",
                    p: 4,
                    bgcolor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    borderRadius: 4,
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    marginTop: "20px"
                }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{
                        background: "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Instagram
                    </Typography>

                    <Typography variant="body2" gutterBottom sx={{ color: "#888" }}>
                        {isLogin ? "Đăng nhập vào tài khoản của bạn." : "Đăng ký để xem ảnh và video từ bạn bè."}
                    </Typography>

                    {user ? (
                        <Fade in={true}>
                            <Box>
                                <Typography variant="h6">Chào mừng, {user.name}!</Typography>
                                <Typography>Email: {user.email}</Typography>
                                {user.birthDate && <Typography>Ngày sinh: {user.birthDate}</Typography>}
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        bgcolor: "#FF6B6B",
                                        "&:hover": {
                                            bgcolor: "#FF5252"
                                        },
                                        transition: "all 0.3s ease"
                                    }}
                                    onClick={() => {
                                        setUser(null);
                                        localStorage.removeItem("token");
                                        dispatch({ type: "auth/logout" });
                                    }}
                                >
                                    Đăng xuất
                                </Button>
                            </Box>
                        </Fade>
                    ) : (
                        <>
                            <GoogleLogin onGoogleSignIn={onGoogleSignIn} text="Đăng nhập bằng google" />
                            <Divider sx={{ my: 3, color: "#666" }}>HOẶC</Divider>

                            {error && (
                                <Fade in={true}>
                                    <Typography color="error" sx={{ mt: 2, p: 1, bgcolor: "rgba(255, 0, 0, 0.1)", borderRadius: 1 }}>
                                        {error}
                                    </Typography>
                                </Fade>
                            )}

                            {socialError && (
                                <Fade in={true}>
                                    <Typography color="error" sx={{ mt: 2, p: 1, bgcolor: "rgba(255, 0, 0, 0.1)", borderRadius: 1 }}>
                                        {socialError}
                                    </Typography>
                                </Fade>
                            )}

                            {loading && (
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                    <CircularProgress size={24} sx={{ color: "#4ECDC4" }} />
                                </Box>
                            )}

                            <Box component="form" noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                                {!isLogin && (
                                    <Fade in={true}>
                                        <Box>
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
                                                sx={{
                                                    mb: 2,
                                                    bgcolor: "rgba(255, 255, 255, 0.05)",
                                                    "& .MuiFilledInput-root": {
                                                        "&:hover": {
                                                            bgcolor: "rgba(255, 255, 255, 0.1)"
                                                        }
                                                    }
                                                }}
                                                InputLabelProps={{ style: { color: "#888" } }}
                                            />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                                                <FormControl fullWidth variant="filled" sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
                                                    <InputLabel sx={{ color: "#888" }}>Ngày</InputLabel>
                                                    <Select
                                                        name="date"
                                                        value={formik.values.date}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.date && Boolean(formik.errors.date)}
                                                        sx={{ color: "#888" }}
                                                    >
                                                        {days.map((d) => (
                                                            <MenuItem key={d} value={d}>{d}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth variant="filled" sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
                                                    <InputLabel sx={{ color: "#888" }}>Tháng</InputLabel>
                                                    <Select
                                                        name="month"
                                                        value={formik.values.month}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.month && Boolean(formik.errors.month)}
                                                        sx={{ color: "#888" }}
                                                    >
                                                        {months.map((m) => (
                                                            <MenuItem key={m} value={m}>{m}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth variant="filled" sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
                                                    <InputLabel sx={{ color: "#888" }}>Năm</InputLabel>
                                                    <Select
                                                        name="year"
                                                        value={formik.values.year}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.year && Boolean(formik.errors.year)}
                                                        sx={{ color: "#888" }}
                                                    >
                                                        {years.map((y) => (
                                                            <MenuItem key={y} value={y}>{y}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                    </Fade>
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
                                    sx={{
                                        mt: 2,
                                        bgcolor: "rgba(255, 255, 255, 0.05)",
                                        "& .MuiFilledInput-root": {
                                            "&:hover": {
                                                bgcolor: "rgba(255, 255, 255, 0.1)"
                                            }
                                        }
                                    }}
                                    InputLabelProps={{ style: { color: "#888" } }}

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
                                    sx={{
                                        mt: 2,
                                        bgcolor: "rgba(255, 255, 255, 0.05)",
                                        "& .MuiFilledInput-root": {
                                            "&:hover": {
                                                bgcolor: "rgba(255, 255, 255, 0.1)"
                                            }
                                        }
                                    }}
                                    InputLabelProps={{ style: { color: "#888" } }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        mt: 3,
                                        bgcolor: "#4ECDC4",
                                        color: "white",
                                        "&:hover": {
                                            bgcolor: "#45B7AF"
                                        },
                                        transition: "all 0.3s ease",
                                        height: "48px"
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} sx={{ color: "white" }} />
                                    ) : (
                                        isLogin ? "Đăng nhập" : "Đăng ký"
                                    )}
                                </Button>
                            </Box>

                            <Typography variant="body2" sx={{ mt: 3, color: "#888" }}>
                                {isLogin ? (
                                    <>
                                        Bạn chưa có tài khoản?{" "}
                                        <Link
                                            href="/signup"
                                            sx={{
                                                color: "#4ECDC4",
                                                textDecoration: "none",
                                                "&:hover": {
                                                    textDecoration: "underline"
                                                }
                                            }}
                                        >
                                            Đăng ký
                                        </Link>
                                        <br />
                                        <Link
                                            href="/forgot-password"
                                            sx={{
                                                mt: 1,
                                                display: "block",
                                                color: "#4ECDC4",
                                                textDecoration: "none",
                                                "&:hover": {
                                                    textDecoration: "underline"
                                                }
                                            }}
                                        >
                                            Quên mật khẩu?
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        Bạn có tài khoản?{" "}
                                        <Link
                                            href="/login"
                                            sx={{
                                                color: "#4ECDC4",
                                                textDecoration: "none",
                                                "&:hover": {
                                                    textDecoration: "underline"
                                                }
                                            }}
                                        >
                                            Đăng nhập
                                        </Link>
                                    </>
                                )}
                            </Typography>
                        </>
                    )}
                </Box>
            </Grow>
        </Container>
    );
}

export default React.memo(Authentication);
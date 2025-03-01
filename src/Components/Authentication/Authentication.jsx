import React, { useState, useEffect } from "react";
import { Container, Box, Typography, TextField, Button, Divider, Link, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../Store/Auth/Action";

function Authentication() {

    const [isLogin, setIsLogin] = useState();
    const authError = useSelector((state) => state.auth.error);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        const path = window.location.pathname;
        setIsLogin(path === "/login");
    }, []);

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

    useEffect(() => {
        if (authError) {
            if (authError !== "Request failed with status code 500") {
                setError(authError);
            }
        }
    }, [authError]);
    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <Container maxWidth={false} sx={{ width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "black" }}>
                <Box sx={{ width: "100%", maxWidth: 400, textAlign: "center", p: 3, bgcolor: "black", color: "white", borderRadius: 2, boxShadow: 3, border: "1px solid #ccc", marginTop: "20px" }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Instagram
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {isLogin ? "Đăng nhập vào tài khoản của bạn." : "Đăng ký để xem ảnh và video từ bạn bè."}
                    </Typography>
                    <Button fullWidth variant="contained" sx={{ bgcolor: "#1877F2", color: "white", mb: 2 }}>
                        {isLogin ? "Đăng nhập bằng Facebook" : "Đăng ký bằng Facebook"}
                    </Button>
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            console.log("Google Login Success:", credentialResponse);
                        }}
                        onError={() => {
                            console.log("Google Login Failed");
                        }}
                    />
                    <Divider sx={{ my: 2 }}>HOẶC</Divider>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
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
                                                <MenuItem key={d} value={d}>
                                                    {d}
                                                </MenuItem>
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
                                                <MenuItem key={m} value={m}>
                                                    {m}
                                                </MenuItem>
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
                                                <MenuItem key={y} value={y}>
                                                    {y}
                                                </MenuItem>
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
                            sx={{ mt: 2, bgcolor: "#333" }}
                            InputLabelProps={{ style: { color: "white" } }}
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
                            sx={{ mt: 2, bgcolor: "#333" }}
                            InputLabelProps={{ style: { color: "white" } }}
                        />

                        <Button fullWidth type="submit" variant="contained" sx={{ mt: 2, bgcolor: "#1877F2", color: "white" }}>
                            {isLogin ? "Đăng nhập" : "Đăng ký"}
                        </Button>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {isLogin ? (
                            <>Bạn chưa có tài khoản? <Link href="/signup" color="primary">Đăng ký</Link></>
                        ) : (
                            <>Bạn có tài khoản? <Link href="/login" color="primary">Đăng nhập</Link></>
                        )}
                    </Typography>
                </Box>

            </Container>
        </GoogleOAuthProvider>
    );
}

export default Authentication;

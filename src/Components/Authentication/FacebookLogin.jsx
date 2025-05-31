import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

const FacebookLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    useEffect(() => {
        // Initialize Facebook SDK
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '1145193784077849',
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });

            window.FB.AppEvents.logPageView();
            setIsSDKLoaded(true);

            // Check login status
            window.FB.getLoginStatus(function (response) {
                console.log('Initial login status:', response);
            });
        };

        // Load Facebook SDK
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    const checkLoginState = (response) => {
        console.log('Login status changed:', response);
        if (response.status === 'connected') {
            // User is logged in and has authorized your app
            const accessToken = response.authResponse.accessToken;

            // Send token to backend
            fetch(`${process.env.REACT_APP_API_URL}/auth/facebook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken: accessToken }),
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log('Backend response:', data);
                    console.log('data.success', data.status);
                    if (data.status) {
                        localStorage.setItem('jwt', data.jwt);

                        dispatch(setUser(data.user));

                        navigate('/');
                    }
                })
                .catch(error => {
                    console.error('Error sending token to backend:', error);
                    alert('Error communicating with the server. Please try again.');
                });
        } else {
            console.log('User is not logged in or has not authorized the app');
        }
    };

    const handleFacebookLogin = () => {
        if (!isSDKLoaded) {
            console.error('Facebook SDK not loaded');
            alert('Facebook SDK is not loaded yet. Please wait a moment and try again.');
            return;
        }

        window.FB.login(function (response) {
            checkLoginState(response);
        }, {
            scope: 'public_profile,email'
        });
    };

    return (
        <Button
            variant="outlined"
            startIcon={<FacebookIcon />}
            onClick={handleFacebookLogin}
            disabled={!isSDKLoaded}
            fullWidth
            sx={{
                color: '#1877F2',
                borderColor: '#1877F2',
                '&:hover': {
                    borderColor: '#166FE5',
                    backgroundColor: 'rgba(24, 119, 242, 0.04)',
                },
                width: '250px',
                textTransform: 'none',
                fontSize: '14px',
                padding: '8px 16px',
                height: '40px',
                marginTop: '8px',
                marginBottom: '8px',
            }}
        >
            Đăng nhập bằng Facebook
        </Button>
    );
};

export default FacebookLogin; 
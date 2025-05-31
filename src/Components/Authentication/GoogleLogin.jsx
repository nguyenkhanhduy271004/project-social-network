import { useRef, useEffect } from 'react';
import useScript from '../../hooks/useScript';

export default function GoogleLogin({
    onGoogleSignIn = () => { },
    text = 'signin_with',
}) {
    const googleSignInButton = useRef(null);

    useScript('https://accounts.google.com/gsi/client', () => {
        window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: onGoogleSignIn,
            ux_mode: 'popup',
            context: 'signin',
            scope: 'email profile',
        });
        window.google.accounts.id.renderButton(
            googleSignInButton.current,
            {
                theme: 'filled_blue',
                size: 'large',
                text,
                width: '250',
                type: 'standard',
            },
        );
    });

    useEffect(() => {
        const handleButtonClick = () => {
            window.google?.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    console.log('Google One Tap is not displayed or skipped', notification);
                }
            });
        };

        const buttonElement = googleSignInButton.current?.querySelector('button');
        if (buttonElement) {
            const defaultOnClick = buttonElement.onclick;
            buttonElement.onclick = (e) => {
                e.preventDefault();
                handleButtonClick();
            };
        }

        return () => {
            const buttonElement = googleSignInButton.current?.querySelector('button');
            if (buttonElement) {
                buttonElement.onclick = null;
            }
        };
    }, []);

    return (
        <div className="flex justify-center items-center" style={{ marginLeft: '40px' }}>
            <div
                ref={googleSignInButton}
                className="flex justify-center items-center w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
                <div className="w-[250px]"></div>
            </div>
        </div>
    );
}
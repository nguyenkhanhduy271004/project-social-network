import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Account from './Components/Account/Account';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminAIChatPage from './Pages/AdminAIChatPage';
import Authentication from './Components/Authentication/Authentication';
import ForgotPassword from './Components/Authentication/ForgotPassword';
import { GlobalLoading } from './Components/Common/LoadingStates';
import TicTacToe from './Components/Game/TicTacToe';
import Groups from './Components/Group/Group';
import GroupDetail from './Components/Group/GroupDetail';
import GroupPage from './Components/Group/GroupPage';
import HomePage from './Components/HomePage/HomePage';
import Message from './Components/Message/Message';
import Profile from './Components/Profile/Profile';
import Reel from './Components/Reel/Reel';
import Chat from './Components/Chat/Chat';
import NotificationList from './Components/Notifications/NotificationList';
import { getUserProfile } from './Store/Auth/Action';
import { ThemeProvider } from './theme/ThemeContext';
import { navigationMenu } from './Components/Navigation/NavigationMenu';
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Notifications from './Pages/Notifications';
import Forbidden from './Components/Common/Forbidden';
import { RootState, User } from './types';
import { AppDispatch } from './Store/Store';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { auth } = useSelector((store: RootState) => store);
    const location = useLocation();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("jwt");
    const theme = useTheme();

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (jwt && !auth.user) {
            dispatch(getUserProfile(jwt)).then(() => setLoading(false)).catch(() => setLoading(false));
        } else {
            const timer = setTimeout(() => setLoading(false), 300);
            return () => clearTimeout(timer);
        }
    }, [auth.user, jwt, dispatch]);

    useEffect(() => {
        if (!jwt) {
            if (location.pathname !== '/signup') {
                navigate("/login");
            }
        }
    }, [jwt, location.pathname, navigate]);

    const handleMenuClose = () => {
        // No-op, kept for future use
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        handleMenuClose();
        navigate('/login');
    };

    if (loading) return <GlobalLoading message="Loading your profile..." />;

    return (
        <ThemeProvider>
            <CssBaseline />
            {auth.user && location.pathname === '/' && (
                <></>
            )}
            <div style={{ paddingTop: 0 }}>
                <Routes>
                    <Route path="/" element={auth.user ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/message" element={auth.user ? <Message /> : <Navigate to="/login" />} />
                    <Route path="/login" element={auth.user ? <Navigate to="/" /> : <Authentication />} />
                    <Route path="/signup" element={auth.user ? <Navigate to="/" /> : <Authentication />} />
                    <Route path="/account" element={auth.user ? <Account /> : <Navigate to="/login" />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/explore" element={<Reel />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/game" element={<TicTacToe />} />
                    <Route path="/groups/:id" element={<GroupDetail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/groups/:groupId" element={<GroupPage />} />
                    <Route path="/ai-chat" element={auth.user ? <Chat /> : <Navigate to="/login" />} />
                    <Route path="/notifications" element={auth.user ? <Notifications /> : <Navigate to="/login" />} />
                    <Route
                        path="/admin"
                        element={
                            auth.user && (auth.user as User).admin
                                ? <AdminDashboard />
                                : <Forbidden />
                        }
                    />
                    <Route
                        path="/admin/ai-chat"
                        element={
                            auth.user && (auth.user as User).admin
                                ? <AdminAIChatPage />
                                : <Forbidden />
                        }
                    />
                    {/* Catch all route for undefined pages */}
                    <Route path="*" element={<Forbidden />} />
                </Routes>
            </div>
        </ThemeProvider>
    );
}

export default App; 
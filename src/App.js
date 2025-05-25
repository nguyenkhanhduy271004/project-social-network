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
import { gapi } from 'gapi-script';
import AuthCallback from './Components/Auth-Callback/AuthCallback';
import { AppBar, Toolbar, Box, Container, IconButton, Avatar, Menu, MenuItem, Typography, Divider } from '@mui/material';
import { navigationMenu } from './Components/Navigation/NavigationMenu';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import Notifications from './Pages/Notifications';
import Forbidden from './Components/Common/Forbidden';

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const location = useLocation();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  useEffect(() => {
    if (jwt && !auth.user) {
      dispatch(getUserProfile(jwt)).finally(() => setLoading(false));
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

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    handleMenuClose();
    navigate('/login');
  };

  if (loading) return <GlobalLoading message="Loading your profile..." />;

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchorEl}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          width: 250,
          maxHeight: 400,
        }
      }}
    >
      {navigationMenu.map((item) => (
        !item.adminOnly || (item.adminOnly && auth.user?.admin) ? (
          <MenuItem
            key={item.path}
            onClick={() => {
              handleMenuClose();
              navigate(item.path);
            }}
            selected={location.pathname === item.path}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {item.icon}
              <Typography>{item.title}</Typography>
            </Box>
          </MenuItem>
        ) : null
      ))}
    </Menu>
  );

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          width: 200,
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={auth.user?.image}
          sx={{ width: 64, height: 64, mb: 1 }}
        />
        <Typography variant="subtitle1">{auth.user?.fullName}</Typography>
        <Typography variant="body2" color="text.secondary">{auth.user?.email}</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate('/account');
      }}>
        <AccountCircleIcon sx={{ mr: 1 }} />
        <Typography>Trang cá nhân</Typography>
      </MenuItem>
      <MenuItem onClick={() => {
        handleMenuClose();
        navigate('/account/settings');
      }}>
        <SettingsIcon sx={{ mr: 1 }} />
        <Typography>Cài đặt</Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <LogoutIcon sx={{ mr: 1 }} />
        <Typography>Đăng xuất</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <ThemeProvider>
      <CssBaseline />
      {auth.user && location.pathname === '/' && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'transparent',
            boxShadow: 'none'
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ justifyContent: 'flex-end' }}>
              <Box sx={{ color: 'black' }}>
                <NotificationList />
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
      <Box sx={{ pt: 0 }}>
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
              auth.user && auth.user.admin
                ? <AdminDashboard />
                : <Forbidden />
            }
          />
          <Route
            path="/admin/ai-chat"
            element={
              auth.user && auth.user.admin
                ? <AdminAIChatPage />
                : <Forbidden />
            }
          />
          {/* Catch all route for undefined pages */}
          <Route path="*" element={<Forbidden />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App; 
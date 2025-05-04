import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Account from './Components/Account/Account';
import AdminDashboard from './Components/Admin/AdminDashboard';
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
import { getUserProfile } from './Store/Auth/Action';
import { ThemeProvider } from './theme/ThemeContext';
import { gapi } from 'gapi-script';
import AuthCallback from './Components/Auth-Callback/AuthCallback';

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const location = useLocation();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(jwt);
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


  if (loading) return <GlobalLoading message="Loading your profile..." />;

  return (
    <ThemeProvider>
      <CssBaseline />
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
        <Route
          path="/admin"
          element={
            auth.user && auth.user.admin
              ? <AdminDashboard />
              : <Navigate to="/" />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

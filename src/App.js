import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage/HomePage';
import Authentication from './Components/Authentication/Authentication';
import Message from './Components/Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserProfile } from './Store/Auth/Action';
import Profile from './Components/Profile/Profile';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt && !auth.user) {
      dispatch(getUserProfile(jwt));
    }
  }, [auth.user, jwt, dispatch]);

  return (
    <div className="">
      <Routes>
        <Route path="/" element={auth.user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/message" element={auth.user ? <Message /> : <Navigate to="/login" />} />
        <Route path="/login" element={auth.user ? <Navigate to="/" /> : <Authentication />} />
        <Route path="/signup" element={auth.user ? <Navigate to="/" /> : <Authentication />} />
      </Routes>
    </div>
  );
}

export default App;

import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage/HomePage';
import Authentication from './Components/Authentication/Authentication';
import Message from './Components/Message/Message';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getUserProfile } from './Store/Auth/Action';
import Profile from './Components/Profile/Profile';

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jwt && !auth.user) {
      dispatch(getUserProfile(jwt)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [auth.user, jwt, dispatch]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <Routes>
      <Route path="/" element={auth.user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/message" element={auth.user ? <Message /> : <Navigate to="/login" />} />
      <Route path="/login" element={auth.user ? <Navigate to="/" /> : <Authentication />} />
      <Route path="/signup" element={auth.user ? <Navigate to="/" /> : <Authentication />} />
      <Route path="/account" element={auth.user ? <Profile /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

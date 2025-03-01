import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './Store/Auth/Action';
import HomePage from './Components/HomePage/HomePage';
import Authentication from './Components/Authentication/Authentication';
import Message from './Components/Message/Message';
import Profile from './Components/Profile/Profile';
import Account from './Components/Account/Account';
import Reel from './Components/Reel/Reel';

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const jwt = localStorage.getItem("jwt");

  const [loading, setLoading] = useState(true);
  // const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (jwt && !auth.user) {
      dispatch(getUserProfile(jwt)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [auth.user, jwt, dispatch]);

  // useEffect(() => {
  //   const socket = new SockJS('http://localhost:8080/ws');
  //   const stomp = Stomp.over(socket);

  //   stomp.connect({}, () => {
  //     console.log("WebSocket connected!");
  //     stomp.subscribe('/topic/notifications', (message) => {
  //       console.log("Received notification:", message.body);
  //     });
  //   }, (error) => {
  //     console.error("WebSocket connection error:", error);
  //   });

  //   setStompClient(stomp);

  //   return () => {
  //     stomp.disconnect(() => {
  //       console.log("WebSocket disconnected");
  //     });
  //   };
  // }, []);

  if (loading) return <h1>Loading...</h1>;

  return (
    <Routes>
      <Route path="/" element={auth.user ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/message" element={auth.user ? <Message /> : <Navigate to="/login" />} />
      <Route path="/login" element={auth.user ? <Navigate to="/" /> : <Authentication />} />
      <Route path="/signup" element={auth.user ? <Navigate to="/" /> : <Authentication />} />
      <Route path="/account" element={auth.user ? <Account /> : <Navigate to="/login" />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/explore" element={<Reel />} />
    </Routes>
  );
}

export default App;

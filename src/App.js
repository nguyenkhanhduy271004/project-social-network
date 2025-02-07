import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Components/HomePage/HomePage';
import Authentication from './Components/Authentication/Authentication';
import Message from './Components/Message/Message';


function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/*" element={true ? <HomePage /> : <Authentication />} />
        <Route path="/message" element={<Message />} />
      </Routes>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';


function App() {
  const [users, setUsers] = useState([]); // Store user data

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login users={users} />} />
        <Route path="/signup" element={<Signup users={users} setUsers={setUsers} />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';  // Import ThemeProvider and createTheme
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSetup from './pages/ProfileSetup';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const token1 = localStorage.getItem('profile');
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (!token1) {
    return <Navigate to="/profile"/>; 
  }

  return children;
};
const ProtectedPRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/profile" />;
  }

  return children;
};


const App = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);  // State for dark mode

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5000/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) =>{
          console.log('hello')
          setUser(response.data)
          localStorage.setItem('profile')
        })
        .catch((err) => {
          //window.location.href = '/profile';
          localStorage.removeItem('profile')
        });  // Remove token if invalid
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);  // Toggle between dark and light mode
  };

  // Create a theme object based on dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',  // Dynamically switch between light and dark
    },
  });

  return (
    <ThemeProvider theme={theme}>  {/* Wrap your app in ThemeProvider */}
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage user={user} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
         
          <Route path="/profile" element={
            <ProtectedPRoute>
              <ProfileSetup />
            </ProtectedPRoute>
            
            } />
          

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

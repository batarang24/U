import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSetup from './pages/ProfileSetup';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const profile = localStorage.getItem('profile');
  const navigate = useNavigate();

  if (!token) {
    // If no token, redirect to login page
    return <Navigate to="/login" />;
  }
  
  if (!profile) {
    // If the profile is not set up, redirect to profile setup page
    return <Navigate to="/profile" />;
  }

  return children; // If both token and profile exist, show the homepage
};

const ProtectedPRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const profile1=localStorage.getItem('profile')
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;  // If no token, redirect to login
  }
  if (profile1)
  {
    return <Navigate to="/"/>;
  }

  return children; // If token exists, allow access to Profile Setup page
};

const App = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);  // State for dark mode

  useEffect(() => {
    console.log(localStorage)
    console.log('ddd')
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5000/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          localStorage.setItem('profile', 'yes');  
          console.log('hh')
          setUser(response.data);
          // Mark profile as completed if response is successful
        })
        .catch((err) => {
          
          console.log('Error fetching profile:', err);
          localStorage.removeItem('profile');  // If there's an error fetching profile, remove the profile flag
        });
    }
  },[]);

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
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Homepage protected route */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage user={user} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          {/* Profile Setup route, only accessible if user is logged in but doesn't have a profile */}
          <Route path="/profile" element={
            <ProtectedPRoute>
              <ProfileSetup />
            </ProtectedPRoute>
          } />

          {/* Public Routes */}
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

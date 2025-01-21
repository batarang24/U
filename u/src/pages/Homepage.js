import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Homepage = ({ user, toggleTheme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.clear();
    navigate('/login');
    
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Here is your profile information.
      </Typography>
      <Typography variant="body1">Address: {user?.address}</Typography>
      <Typography variant="body1">District: {user?.district}</Typography>
      <Typography variant="body1">State: {user?.state}</Typography>
      <Typography variant="body1">Phone: {user?.phone}</Typography>
      {/* More user info here */}

      <Button variant="contained" onClick={handleLogout} sx={{ marginTop: 3 }}>
        Logout
      </Button>
    </Box>
  );
};

export default Homepage;

import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, Grid, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import LightModeIcon from '@mui/icons-material/LightMode'; // Light mode icon
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Dark mode icon

const Homepage = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'white', color: 'black', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: { xs: '10px 20px', sm: '20px 40px' }, // Adjust padding for small screens
          backgroundColor: 'white',
          color: 'black',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Kaam</Typography>
        <Box>
          <Button color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Home</Button>
          <Button color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Profile</Button>
          <Button color="inherit" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>Logout</Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: 'white',
          padding: { xs: '40px 20px', sm: '60px 20px' }, // Adjust padding for small screens
          textAlign: 'center',
          marginX: 'auto',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '2.2rem', sm: '3rem' }, // Adjust font size for small screens
          }}
        >
          Welcome to Kaam
        </Typography>
        <Typography
          variant="h6"
          sx={{
            marginTop: 2,
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          Your dream job is waiting. Manage your profile and get a call!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: 3,
            padding: { xs: '10px 20px', sm: '12px 24px' }, // Adjust button padding for small screens
            fontSize: { xs: '0.9rem', sm: '1rem' }, // Adjust button text size for small screens
          }}
        >
          Update Profile
        </Button>
      </Box>
    </Box>
  );
};

export default Homepage;

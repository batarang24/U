import React from 'react';
import { Button, Box, Typography, Card, CardContent, Avatar, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // Import useTheme to access the theme
import EditIcon from '@mui/icons-material/Edit';
import LightModeIcon from '@mui/icons-material/LightMode'; // Light mode icon
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Dark mode icon

const Homepage = ({ user, toggleTheme }) => {
  const navigate = useNavigate();
  const theme = useTheme();  // Use useTheme hook to get the current theme

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const renderSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills.join(', ');
    }
    return 'No skills provided';
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, textAlign: 'center' }}>
      <Card sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} alt="Profile Picture" src="/static/images/avatar/1.jpg" />
          <Typography variant="h5">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user ? user.occupation : 'Loading occupation...'}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Skills:</strong> {user ? renderSkills(user.skills) : 'Loading skills...'}
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Experience:</strong> {user ? `${user.yearsOfExperience} years` : 'Loading experience...'}
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
        <IconButton color="primary" onClick={handleEditProfile} sx={{ ml: 2 }}>
          <EditIcon />
        </IconButton>
        {/* Toggle Theme */}
        <IconButton color="primary" onClick={toggleTheme} sx={{ ml: 2 }}>
          {theme.palette.mode === 'dark' ? (
            <LightModeIcon />
          ) : (
            <DarkModeIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Homepage;

import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Alert, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ emailOrUserId: '', password: '' });
  const [message, setMessage] = useState({ open: false, text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.emailOrUserId || !form.password) {
      setMessage({ open: true, text: 'All fields are required.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage({ open: true, text: 'Login successful!', type: 'success' });
        const token = localStorage.getItem('token');
        if (token) {
          axios
            .get('http://localhost:5000/profile', { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
              localStorage.setItem('profile', 'yes');  
              console.log('hh')
              
              // Mark profile as completed if response is successful
            })
            .catch((err) => {
              
              console.log('Error fetching profile:', err);
              localStorage.removeItem('profile');  // If there's an error fetching profile, remove the profile flag
            });
        }
        navigate('/')
       
      } else {
        setMessage({ open: true, text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ open: true, text: 'An error occurred during login.', type: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 ,p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      <TextField
        label="Email or User ID"
        name="emailOrUserId"
        fullWidth
        margin="normal"
        value={form.emailOrUserId}
        onChange={handleChange}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        onChange={handleChange}
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        Login
      </Button>
      <Typography sx={{ mt: 2 }} align="center">
        Don't have an account? <Link to="/signup">Signup</Link>
      </Typography>
      <Typography sx={{ mt: 2 }} align="center">
        Forgot your password? <Link to="/forgot-password">Reset it</Link>
      </Typography>

      {/* Snackbar for feedback */}
      <Snackbar
        open={message.open}
        autoHideDuration={3000}
        onClose={() => setMessage({ ...message, open: false })}
      >
        <Alert onClose={() => setMessage({ ...message, open: false })} severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}

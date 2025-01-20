import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ open: false, text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        // Store JWT token in localStorage or context
        localStorage.setItem('authToken', data.token);
        setMessage({ open: true, text: 'Login successful!', type: 'success' });
        setTimeout(() => navigate('/profile'), 1500); // Redirect to profile or dashboard
      } else {
        setMessage({ open: true, text: data.message || 'Login failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ open: true, text: 'An error occurred', type: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      <TextField
        label="Email or User ID"
        name="email"
        fullWidth
        margin="normal"
        value={form.email}
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
      <GoogleButton />
      <Typography sx={{ mt: 2 }} align="center">
        Don't have an account? <Link to="/signup">Signup</Link>
      </Typography>
      <Typography sx={{ mt: 2 }} align="center">
        Forgot your password? <Link to="/forgot-password">Reset it</Link>
      </Typography>

      {/* Snackbar for messages */}
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

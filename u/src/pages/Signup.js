import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ userId: '', email: '', password: '' });
  const [message, setMessage] = useState({ open: false, text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { userId, email, password } = form;

    // Basic validations
    if (userId.length < 4 || userId.length > 8) {
      setMessage({ open: true, text: 'User ID must be 4-8 characters.', type: 'error' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ open: true, text: 'Invalid email format.', type: 'error' });
      return;
    }
    if (password.length < 5 || password.length > 10) {
      setMessage({ open: true, text: 'Password must be 5-10 characters.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ open: true, text: 'Signup successful! Redirecting to login...', type: 'success' });
        setTimeout(() => navigate('/login'), 1500); // Redirect to login after 1.5s
      } else {
        setMessage({ open: true, text: data.message || 'Signup failed.', type: 'error' });
      }
    } catch (error) {
      setMessage({ open: true, text: 'An error occurred during signup.', type: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Signup
      </Typography>
      <TextField
        label="User ID"
        name="userId"
        fullWidth
        margin="normal"
        value={form.userId}
        onChange={handleChange}
      />
      <TextField
        label="Email"
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
        Signup
      </Button>

      <Typography sx={{ mt: 2 }} align="center">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>

      <Snackbar open={message.open} autoHideDuration={3000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert onClose={() => setMessage({ ...message, open: false })} severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}   
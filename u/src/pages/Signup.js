import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ userId: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ open: false, text: '', type: '' });
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (form.userId.length < 5 || form.userId.length > 10) {
      newErrors.userId = 'User ID must be between 5 and 10 characters.';
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (form.password.length < 5 || form.password.length > 10) {
      newErrors.password = 'Password must be between 5 and 10 characters.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ open: true, text: 'Signup successful!', type: 'success' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage({ open: true, text: data.message || 'Signup failed', type: 'error' });
      }
    } catch (error) {
      setMessage({ open: true, text: 'An error occurred', type: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Signup
      </Typography>
      <TextField
        label="User ID"
        name="userId"
        fullWidth
        margin="normal"
        value={form.userId}
        onChange={handleChange}
        error={!!errors.userId}
        helperText={errors.userId}
      />
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={form.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        Signup
      </Button>
      <Typography sx={{ mt: 2 }} align="center">
        Already have an account? <Link to="/">Login</Link>
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

// ForgotPassword.js
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ open: false, text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      setMessage({ open: true, text: 'Please enter your email.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ open: true, text: data.message, type: 'success' });
      } else {
        setMessage({ open: true, text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ open: true, text: 'An error occurred. Please try again.', type: 'error' });
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Forgot Password
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        Send Reset Link
      </Button>
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

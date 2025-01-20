// ResetPassword.js
import React, { useState } from 'react';
import { TextField, Button, Box, Snackbar, Alert, Typography } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ open: false, text: '', type: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Get token from query parameters

  const handleSubmit = async () => {
    if (!password) {
      setMessage({ open: true, text: 'Please enter a new password.', type: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage({ open: true, text: 'Password reset successful! Redirecting to login...', type: 'success' });
        setTimeout(() => navigate('/login'), 1500);
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
        Reset Password
      </Typography>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        Reset Password
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

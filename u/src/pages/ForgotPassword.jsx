import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    alert(`If this email exists, a reset link will be sent to ${email}.`);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleReset}>
        Reset Password
      </Button>
    </Box>
  );
}

export default ForgotPassword;
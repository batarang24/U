import React from 'react';
import { Button } from '@mui/material';

export default function GoogleButton() {
  const handleGoogleSignIn = () => {
    alert('Google Sign-In Clicked!');
  };

  return (
    <Button
      variant="outlined"
      color="secondary"
      fullWidth
      sx={{ mt: 2 }}
      onClick={handleGoogleSignIn}
    >
      Sign in with Google
    </Button>
  );
}

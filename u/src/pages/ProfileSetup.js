import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Box, Typography, Paper } from '@mui/material';

const ProfileSetup = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    district: '',
    state: '',
    phone: '',
    occupation: '',
    yearsOfExperience: '',
    skills: '',
    interestedJobs: '',
    passportNumber: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validate = () => {
    const {
      firstName,
      lastName,
      address,
      district,
      state,
      phone,
      yearsOfExperience,
      passportNumber,
    } = userData;

    if (
      !firstName ||
      !lastName ||
      !address ||
      !district ||
      !state ||
      !phone ||
      !yearsOfExperience ||
      !passportNumber
    ) {
      return 'All fields are required';
    }
    if (firstName.length < 3 || firstName.length > 25) {
      return 'First name must be between 3 and 25 characters';
    }
    if (lastName.length < 3 || lastName.length > 25) {
      return 'Last name must be between 3 and 25 characters';
    }
    if (address.length < 8 || address.length > 26) {
      return 'Address must be between 8 and 26 characters';
    }
    if (district.length > 20) {
      return 'District must be less than 20 characters';
    }
    if (state.length > 20) {
      return 'State must be less than 20 characters';
    }
    if (!/^\d{10}$/.test(phone)) {
      return 'Phone number must be 10 digits';
    }
    if (isNaN(yearsOfExperience) || yearsOfExperience <= 0) {
      return 'Years of experience must be a positive number';
    }
    if (passportNumber.length>20 || passportNumber.length<=3) {
      return 'Invalid passport number format';
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMessage = validate();

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const token = localStorage.getItem('token');

    axios
      .post(
        'http://localhost:5000/set-profile',
        {
          ...userData,
          skills: userData.skills.split(',').map((s) => s.trim()),
          interestedJobs: userData.interestedJobs.split(',').map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        window.location.href = '/';
      })
      .catch((err)=>{
        console.log(err)
        setError(err.response?.data?.message || 'Error setting up profile');
      });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        pt: 5, // Moves the form downward
        px: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: 500,
          padding: 10,
          borderRadius: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: '700', color: '#0d47a1' }}>
            Kaam
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
            Fill in the details below to complete your profile.
          </Typography>
        </Box>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="First Name"
                fullWidth
                value={userData.firstName}
                onChange={handleChange}
                name="firstName"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Last Name"
                fullWidth
                value={userData.lastName}
                onChange={handleChange}
                name="lastName"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                value={userData.address}
                onChange={handleChange}
                name="address"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="District"
                fullWidth
                value={userData.district}
                onChange={handleChange}
                name="district"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="State"
                fullWidth
                value={userData.state}
                onChange={handleChange}
                name="state"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                fullWidth
                value={userData.phone}
                onChange={handleChange}
                name="phone"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Occupation"
                fullWidth
                value={userData.occupation}
                onChange={handleChange}
                name="occupation"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Years of Experience"
                fullWidth
                value={userData.yearsOfExperience}
                onChange={handleChange}
                name="yearsOfExperience"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Skills (comma-separated)"
                fullWidth
                value={userData.skills}
                onChange={handleChange}
                name="skills"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Interested Jobs (comma-separated)"
                fullWidth
                value={userData.interestedJobs}
                onChange={handleChange}
                name="interestedJobs"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Passport Number"
                fullWidth
                value={userData.passportNumber}
                onChange={handleChange}
                name="passportNumber"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  fontWeight: '600',
                  backgroundColor: '#0d47a1',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#083978' },
                }}
              >
                Save Profile
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProfileSetup;

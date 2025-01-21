import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Box, Typography, Paper, IconButton, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

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

  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2 MB');
        return;
      }
      setError(null);
      setResume(file);
    }
  };

  const removeResume = () => {
    setResume(null);
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
  
    // Checking if required fields are filled
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
      return 'All fields are required except for the resume.';
    }
  
    // Check if resume is uploaded
    if (!resume) {
      return 'Resume is required.';
    }
  
    // Additional checks for length or formatting
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
    if (passportNumber.length > 20 || passportNumber.length <= 3) {
      return 'Invalid passport number format';
    }
  
    return null; // No error
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMessage = validate();

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setIsSubmitting(true); // Set loading state

    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });
    if (resume) {
      formData.append('resume', resume);
    }

    axios
      .post('http://localhost:5000/set-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        // Reset form and resume state upon success
        setUserData({
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
        setResume(null);
        //localStorage.setItem('profile')
        window.location.href = '/'; // Redirect to another page (e.g., homepage)
      })
      .catch((err) => {
        console.log(err)
        setError(err.response?.data?.message || 'Error setting up profile');
      })
      .finally(() => {
        setIsSubmitting(false); // Set loading state to false
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
        pt: 5,
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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: '700', color: '#0d47a1' }}>
            Kaam
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
            Fill in the details below to complete your profile.
          </Typography>
        </Box>

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

            {/* Cloud-like Resume Upload Section */}
            <Grid item xs={12}>
              <Stack direction="column" alignItems="center" spacing={2} sx={{ border: '2px dashed #0d47a1', padding: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                  <CloudUploadIcon sx={{ fontSize: 50, color: '#0d47a1' }} />
                  <Typography variant="body1" sx={{ color: '#0d47a1', fontWeight: '500', mt: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        fontWeight: '500',
                        color: '#0d47a1',
                        borderColor: '#0d47a1',
                        '&:hover': { backgroundColor: '#bbdefb', borderColor: '#0d47a1' },
                        mt: 1,
                      }}
                    >
                      ADD YOUR RESUME
                      <input type="file" hidden onChange={handleResumeChange} accept=".pdf" />
                    </Button>
                  </Typography>
                </Box>
                {resume && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2" sx={{ color: '#0d47a1', flexGrow: 1 }}>
                      {resume.name}
                    </Typography>
                    <IconButton onClick={removeResume} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Stack>
              {!resume && (
                <Typography variant="caption" sx={{ color: '#6b7280', textAlign: 'center', mt: 2 }}>
                  Only PDF files are allowed, max size 2 MB.
                </Typography>
              )}
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
                disabled={isSubmitting} // Disable button when submitting
              >
                {isSubmitting ? 'Saving Profile...' : 'Save Profile'}
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
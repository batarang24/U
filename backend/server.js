require('dotenv').config(); // For loading environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('./db'); // Import the MySQL connection from db.js
const sendEmail = require('./email');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Secret Key
const SECRET_KEY = process.env.SECRET_KEY || 'yourSuperSecretKey';

// Signup Route
app.post('/signup', async (req, res) => {
  const { userId, email, password } = req.body;

  if (!userId || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validate userId, email, and password
  if (userId.length < 4 || userId.length > 8) {
    return res.status(400).json({ message: 'User ID must be between 4 and 8 characters.' });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  if (password.length < 5 || password.length > 10) {
    return res.status(400).json({ message: 'Password must be between 5 and 10 characters.' });
  }

  connection.query(
    'SELECT * FROM users WHERE userId = ? OR email = ?',
    [userId, email],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });

      // Check for existing userId and email
      const existingUser = results.find((user) => user.userId === userId);
      const existingEmail = results.find((user) => user.email === email);

      if (existingUser) {
        return res.status(400).json({ message: 'User ID already exists.' });
      }
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists.' });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      connection.query(
        'INSERT INTO users (userId, email, password) VALUES (?, ?, ?)',
        [userId, email, hashedPassword],
        (err, results) => {
          if (err) return res.status(500).json({ message: 'Database error.' });
          res.status(201).json({ message: 'Signup successful!' });
        }
      );
    }
  );
});

// Login Route
app.post('/login', (req, res) => {
  const { emailOrUserId, password } = req.body;

  if (!emailOrUserId || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  connection.query(
    'SELECT * FROM users WHERE email = ? OR userId = ?',
    [emailOrUserId, emailOrUserId],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });

      if (results.length === 0) {
        return res.status(400).json({ message: 'User not found.' });
      }

      const user = results[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Incorrect password.' });
      }

      const token = jwt.sign({ userId: user.userId, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

      // Check if user has completed profile setup
      connection.query('SELECT * FROM user_profiles WHERE userId = ?', [user.userId], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error checking profile setup.' });
        }

        const profileCompleted = results.length > 0;  // If results exist, profile is complete
        res.status(200).json({
          message: 'Login successful!',
          token,
          profileCompleted,  // Send back profile status (completed or not)
        });
      });
    }
  );
});

// Protected Route to Get User Profile
app.get('/profile', (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    connection.query('SELECT * FROM user_profiles WHERE userId = ?', [decoded.userId], (err, results) => {
      if (err) {
        console.error("Database query error:", err); // Log database query error
        return res.status(500).json({ message: 'Error fetching profile data' });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'Profile not set up' });
      }

      res.status(200).json(results[0]); // Return user profile data if profile is complete
    });
  });
});

// Forgot Password Route
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Email not found.' });
    }

    const user = results[0];
    const token = jwt.sign({ userId: user.userId, email: user.email }, SECRET_KEY, { expiresIn: '15m' });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    try {
      await sendEmail(email, 'Password Reset', `Reset your password using this link: ${resetLink}`);
      res.status(200).json({ message: 'Password reset email sent!' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending email. Please try again.' });
    }
  });
});

// Reset Password Route
app.post('/reset-password', (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (password.length < 5 || password.length > 10) {
      return res.status(400).json({ message: 'Password must be between 5 and 10 characters.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    connection.query(
      'UPDATE users SET password = ? WHERE userId = ?',
      [hashedPassword, decoded.userId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Database error.' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Password reset successful!' });
      }
    );
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

// Profile Setup Route
app.post('/set-profile', upload.single('resume'), (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { firstName, lastName, address, district, state, phone, occupation, yearsOfExperience, skills, interestedJobs, passportNumber } = req.body;

  console.log("Received data:", req.body);

  if (!firstName || !lastName || !address || !district || !state || !phone || !occupation || !yearsOfExperience || !skills || !interestedJobs || !passportNumber) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Ensure resume is uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'Resume is required.' });
  }

  // Validation logic
  if (firstName.length < 3 || firstName.length > 25) {
    return res.status(400).json({ message: 'First name must be between 3 and 25 characters.' });
  }
  if (lastName.length < 3 || lastName.length > 25) {
    return res.status(400).json({ message: 'Last name must be between 3 and 25 characters.' });
  }
  if (address.length < 8 || address.length > 26) {
    return res.status(400).json({ message: 'Address must be between 8 and 26 characters.' });
  }
  if (district.length > 20) {
    return res.status(400).json({ message: 'District must be less than 20 characters.' });
  }
  if (state.length > 20) {
    return res.status(400).json({ message: 'State must be less than 20 characters.' });
  }
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be 10 digits long.' });
  }
  if (isNaN(yearsOfExperience)) {
    return res.status(400).json({ message: 'Years of experience must be a number.' });
  }
  if (passportNumber.length > 20) {
    return res.status(400).json({ message: 'Passport number must be less than 20 characters.' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    connection.query(
      'INSERT INTO user_profiles (userId, firstName, lastName, address, district, state, phone, occupation, yearsOfExperience, skills, interestedJobs, passportNumber, resumePath) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [decoded.userId, firstName, lastName, address, district, state, phone, occupation, yearsOfExperience, skills, interestedJobs, passportNumber, req.file.filename],
      (err, result) => {
        if (err) {
          console.error('Error inserting profile data:', err); // Improved error logging
          return res.status(500).json({ message: 'Error saving profile data.' });
        }
    
        console.log('Profile data inserted successfully:', result); // Log success details
        return res.status(201).json({ message: 'Profile setup complete!' });
      }
    );
    

  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

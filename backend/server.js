const express = require('express');
const cors = require('cors'); // Import cors
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());

const SECRET_KEY = 'yourSuperSecretKey'; // Or use environment variables

// Dummy user data (for now, stored in memory)
let users = [];

// Signup Route
app.post('/signup', (req, res) => {
  const { userId, email, password } = req.body;

  // Validate input...
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Save user in memory
  users.push({ userId, email, password: hashedPassword });

  return res.status(201).json({ message: 'Signup successful!' });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ email: user.email, userId: user.userId }, SECRET_KEY, { expiresIn: '1h' });

  return res.status(200).json({ message: 'Login successful!', token });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

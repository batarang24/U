// db.js
const mysql = require('mysql2');

// MySQL Connection Setup
const connection = mysql.createConnection({
  host: 'localhost', // MySQL server address (use your own if different)
  user: 'root', // MySQL username
  password: '1234', // MySQL password
  database: 'BCollar', // Your database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL connected to BCollar database');
});

module.exports = connection;

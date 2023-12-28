const express = require('express');
const mysql = require('mysql');
require('dotenv').config();

// Create Express app
const app = express();

// MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_database,
});

// Connect to MySQL
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Define a GET endpoint
app.get('/users', (req, res) => {
  // SQL query to fetch all users
  const sql = 'SELECT * FROM demotable';

  // Execute SQL query
  connection.query(sql, (err, results) => {
    if (err) throw err;

    // Send the results as a response
    res.json(results);
  });
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

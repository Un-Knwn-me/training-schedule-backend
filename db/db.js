const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_host,
    user: process.env.DB_user,
    password: process.env.DB_password,
    port: process.env.DB_port,
    database: process.env.DB_database,
  })

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error(err);
//   }

//   const query = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_database}`;

//   connection.query(query, (queryErr) => {
//     connection.release();

//     if (queryErr) {
//       console.error(queryErr);
//     }

//     console.log(`Database ${process.env.DB_database} connected successfully`);
//   });
// });
  
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = connection;
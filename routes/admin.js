var express = require('express');
var router = express.Router();
const connection = require('../db/db');
const { hashPassword, hashCompare, createToken, isAdmin } = require('../middleware/auth');

// sign up the user
router.post('/signUp', async(req, res)=> {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const sql = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';

    // Execute SQL query with user input
    connection.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
      } else {
        res.status(200).json({
          message: 'User created successfully',
          user: {
            id: result.insertId,
            name: name,
            email: email,
          },
        });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// signin
router.post("/signin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const findUserQuery = 'SELECT * FROM admins WHERE email = ?';

    // Execute SQL query to find the user
    connection.query(findUserQuery, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error", error: err });
      }
      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = await hashCompare(password, user.password);

        if (passwordMatch) {
          const token = await createToken({
            email: user.email,
            name: user.name,
            role: user.role,
          });

          res.status(200).json({
            message: "User successfully logged in",
            token,
            role: user.role,
            user: user.id,
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// schedule date and time
router.post('/schedule/add', isAdmin, async(req, res)=> {
    try {
      const { date, startTime, endTime } = req.body;

      const sql = 'INSERT INTO trainingschedules (date, startTime, endTime) VALUES (?, ?, ?)';
  
      // Execute SQL query with user input
      connection.query(sql, [date, startTime, endTime], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error', error: err.message });
        } else {
          res.status(200).json({
            message: 'Training Schedule created successfully',
            schedule: {
              id: result.insertId,
              date: date,
              startTime: startTime,
              endTime: endTime
            },
          });
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });

// create course
router.post('/course/add', isAdmin, async(req, res) => {
    try {
        const { name, description } = req.body;

        const sql = 'INSERT INTO courses (name, description) VALUES (?, ?)';

        // Execute SQL query with user input
      connection.query(sql, [name, description], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error', error: err.message });
        } else {
          res.status(200).json({
            message: 'Course created successfully',
            course: {
              id: result.insertId,
              name: name
            },
          });
        }
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message }); 
    }
})

module.exports = router;
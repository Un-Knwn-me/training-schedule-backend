var express = require('express');
const connection = require('../db/db');
var router = express.Router();
const { hashPassword, hashCompare, createToken, isSignedIn } = require('../middleware/auth');

// sign up the user
router.post('/signUp', async(req, res)=> {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const sql = 'INSERT INTO students (name, email, password) VALUES (?, ?, ?)';

    // Execute SQL query with user input
    connection.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
      } else {
        res.status(201).json({
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

    const findUserQuery = 'SELECT * FROM students WHERE email = ?';

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

// get the course and schedule details
router.get('/details', isSignedIn, async(req, res) => {
  try {
    const coursesQuery = 'SELECT * FROM courses';
    const scheduleQuery = 'SELECT * FROM trainingschedules';

    // SQL queries
    connection.query(coursesQuery, (coursesErr, coursesResults) => {
      if (coursesErr) {
        console.error(coursesErr);
        res.status(500).json({ message: 'Internal Server Error', error: coursesErr.message });
      } else {
        connection.query(scheduleQuery, (scheduleErr, scheduleResults) => {
          if (scheduleErr) {
            console.error(scheduleErr);
            res.status(500).json({ message: 'Internal Server Error', error: scheduleErr.message });
          } else {
            res.status(200).json({
              message: 'Success',
              data: {
                courses: coursesResults,
                trainingSchedule: scheduleResults,
              },
            });
          }
        });
      }
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// register
router.post('/register', isSignedIn, async(req, res) => {
  try {
    const { studentId, courseId, scheduleId } = req.body;

    const sql = 'INSERT INTO registrations (studentId, courseId, scheduleId) VALUES (?, ?, ?)';

    // Execute SQL query with user input
    connection.query(sql, [studentId, courseId, scheduleId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
      } else {
        res.status(201).json({
          message: 'Registration successfully',
          register: {
            id: result.insertId,
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
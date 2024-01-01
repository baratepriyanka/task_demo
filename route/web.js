const express = require('express');
var router = express.Router();
const connection = require('../db');

router.post('/create_user', (req, res) => {
    console.log("user");
    const { username, age, hobbie } = req.body;
    if (!username || !age) {
      res.status(400).json({ message: "this filed is required" })
    }
    const userId = uuidv4();
    const insertQuery = `INSERT INTO users (id, username, age, hobbie) VALUES ('${userId}','${username}', ${age}, '${hobbie}')`;
  
    connection.query(insertQuery, (err, data) => {
      if (err) {
        res.status(4000).json({ err, success: "something went worg!!!" })
      } else {
  
        res.status(201).json({ data, success: "newly created record!!!" });
      }
    });
  });
  router.post('/update_user/:id', (req, res) => {
    const id = req.params.id;
    const { username, age, hobbie } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Invalid userId format" });
    }
    if (!username || !age) {
      return res.status(400).json({ message: "Username and age are required fields" });
    }
    const updateQuery = 'UPDATE users SET username=?, age=?, hobbie=? WHERE id=?';
    connection.query(updateQuery, [username, age, hobbie, id], (err, data) => {
      if (err) {
        return res.status(500).json({ err, success: "Internal Server Error" });
      }
      if (data.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }
      res.status(200).json({ success: "Record updated successfully" });
    });
  });
  router.get('/all_user', (req, res) => {
    const allQuery = `select * from users`;
    connection.query(allQuery, (err, data) => {
      res.status(200).json(data);
    });
  });
  
  router.get('/get_user_id/:id', (req, res) => {
    const userId = req.params.id
    if (!userId) {
      res.status(400).json({ message: 'Invalid userId ' });
      return;
    }
    const getUserIdQuery = `SELECT * FROM users `;
    connection.query(getUserIdQuery, (err, data) => {
      const user = data.find((u) => u.id === userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  });
  router.delete('/delete_id/:id', (req, res) => {
    const userId = req.params.id;
  
    if (!userId) {
      res.status(400).json({ message: 'Invalid userId' });
      return;
    }
  
    const getUserIdQuery = `SELECT * FROM users WHERE id = ?`;
  
    connection.query(getUserIdQuery, [userId], (err, data) => {
      if (data.length > 0) {
        const deleteQuery = `DELETE FROM users WHERE id = ?`;
        connection.query(deleteQuery, [userId], (deleteErr) => {
          if (deleteErr) {
            console.error(deleteErr);
            res.status(500).json({ message: 'Internal Server Error' });
          } else {
            res.status(204).json({ message: 'Deleted successfully' });
          }
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });
  });
  
  module.exports=router;
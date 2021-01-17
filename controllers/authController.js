const express = require('express');
const router = express.Router();
const db = require('../models');

// CURRENT ROUTE: /users

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  console.log('Made POST to /users/signup');
  console.log('req.body:', req.body);

  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  db.User.create(newUser, (err, createdUser) => {
    if (err) return res.send('There was an issue getting your data');

    res.redirect('/login');
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  // Check form data to authenticate the user
  res.send('You are now logged in');
})

module.exports = router;

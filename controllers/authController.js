const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../models');

// CURRENT ROUTE: /users

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  // Verify req.body has username and password
  if (!req.body.username || !req.body.password) {
    res.redirect('/signup');
  }

  try {
    // Check if username already exists
    const existingUser = await db.User.findOne({username: req.body.username});
    if (existingUser) return res.send('A user with that username already exists');
    
    // Generate salt and hash user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
    // Replaced newUser's plain text password with hashed password
    const newUser = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    };
  
    // Create new User
    await db.User.create(newUser);

    // Direct to login page
    res.redirect('/login');

  } catch(err) {
    console.log(err);
    return res.send('There was an issue signing you up.');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    // Get user by username
    const foundUser = await db.User.findOne({ username: req.body.username });
  
    if (!foundUser) {
      return res.send('No user found with those credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
    if (!isMatch) return res.send('No user found with those credentials');

    // Add username to session data
    req.session.currentUser = foundUser;

    // Redirect to account page
    res.redirect('/');

  } catch(err) {
    console.log(err);
    res.send('There was an issue verifying your user.');
  }
})

module.exports = router;

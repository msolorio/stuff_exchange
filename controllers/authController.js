const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../models');

// CURRENT ROUTE: /

////////////////////////////////////////////////////////////////////////////
// SIGNUP PAGE
////////////////////////////////////////////////////////////////////////////
router.get('/signup', (req, res) => {
  console.log('message:', req.query.message);
  res.render('signup', {
    message: req.query.message
  });
});


////////////////////////////////////////////////////////////////////////////
// HANDLES SUBMIT OF SIGNUP FORM
////////////////////////////////////////////////////////////////////////////
router.post('/signup', async (req, res) => {
  // Verify req.body has username and password
  if (!req.body.username || !req.body.password) {
    return res.redirect('/signup?message=Username and password fields are required.');
  }

  try {
    // Check if username already exists
    const existingUser = await db.User.findOne({username: req.body.username});

    if (existingUser) return res.redirect('/signup?message=A user with that username already exists.');
    
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
    return res.redirect('/login');

  } catch(err) {
    console.log(err);
    return res.redirect('/signup?message=There was an error signing you up.');
  }
});


////////////////////////////////////////////////////////////////////////////
// LOGIN PAGE
////////////////////////////////////////////////////////////////////////////
router.get('/login', (req, res) => {
  res.render('login', {
    message: req.query.message
  });
});


////////////////////////////////////////////////////////////////////////////
// HANDLES SUBMIT OF LOGIN FORM
////////////////////////////////////////////////////////////////////////////
router.post('/login', async (req, res) => {
  try {
    // Get user by username
    const foundUser = await db.User.findOne({ username: req.body.username });
  
    if (!foundUser) {
      return res.redirect('/login?message=No user found with those credentials');
    }

    // Verify password
    const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
    if (!isMatch) return res.redirect('/login?message=No user found with those credentials');

    // Add username to session data
    req.session.currentUser = foundUser;

    // Redirect to account page
    return res.redirect('/');

  } catch(err) {
    console.log(err);
    return res.redirect('/login?message=There was an issue verifying your user.');
  }
})

module.exports = router;

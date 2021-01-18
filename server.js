const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const protectRoute = require('./utilities/protectRoute');
const authController = require('./controllers/authController');
const app = express();
const PORT = 4000;

// CONFIG / MIDDLEWARE
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'milo the barking dog',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2
  }
}));


// CONTROLLERS
app.use('/', authController);


app.get('/', protectRoute, (req, res) => {
  res.render('account', {
    username: req.session.currentUser.username
  });
});


app.get('/welcome', (req, res) => {
  res.render('welcome');
});


app.get('*', (req, res) => {
  res.redirect('/welcome');
})


app.listen(PORT, () => {
  console.log(`
Your server is running on PORT: ${PORT}.
You better go and catch it...`
  );
});

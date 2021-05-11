const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const protectRoute = require('./utilities/protectRoute');
const authController = require('./controllers/authController');
const itemsController = require('./controllers/itemsController');


// Configuration ===================================================//
const app = express();
const PORT = process.env.PORT || 4000;
app.set('view engine', 'ejs');


// Middleware ======================================================//
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  next();
});


app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'milo the barking dog',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 2
  }
}));


// CONTROLLERS
app.use('/users', authController);
app.use('/items', protectRoute, itemsController);




app.get('/', protectRoute, (req, res) => {
  if (req.session.currentUser) {
    return res.redirect('/users/myaccount');
  }

  res.redirect('/welcome');
});




app.get('/welcome', (req, res) => {
  res.render('welcome', { currentUser: req.session.currentUser });
});




// app.get('*', (req, res) => {
//   res.redirect('/welcome');
// })




app.listen(PORT, () => {
  console.log(
`Your server is running on PORT: ${PORT}.
You better go and catch it...`
  );
});

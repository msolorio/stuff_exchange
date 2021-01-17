const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 4000;
const authController = require('./controllers/authController');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'milo the barking dog',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use('/', authController);

app.get('/', (req, res) => {
  res.send('Home page');
});

app.listen(PORT, () => {
  console.log(`
Your server is running on PORT: ${PORT}.
You better go and catch it...`
  );
});

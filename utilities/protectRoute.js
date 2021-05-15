// Check if user is logged in. If not redirect
// to Welcome Page
function protectRoute(req, res, next) {

  // Adds test user for development
  // TODO: Revert to redirect to /welcome if no currentUser
  if (!req.session.currentUser) {
    // req.session.currentUser = {
    //   "_id" : "609d9d7bda0cb267ba5ca0bf",
    //   "items" : [ ],
    //   "conversations" : [
    //     "609d9d992d421c67ccc52472"
    //   ],
    //   "username": "b",
    //   "email": "b",
    //   "password": "$2b$10$bcBTP4CMwtjyb8tYO3UQiuXUF9JFKpD9CLA4dQHmVsbkjxWG7ET4i",
    // }

    return res.redirect('/welcome');
  }

  next();
}

module.exports = protectRoute;

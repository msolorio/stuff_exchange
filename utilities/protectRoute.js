// Check if user is logged in. If not redirect
// to Welcome Page
function protectRoute(req, res, next) {

  // Adds test user for development
  // TODO: Revert to redirect to /welcome if no currentUser
  if (!req.session.currentUser) {
    req.session.currentUser = {
      username: 'testuser',
      email: 't@t',
      password: '1',
      _id: '6004a6832095c3eae9ad0e87'
    }

    // return res.redirect('/welcome');
  }

  next();
}

module.exports = protectRoute;

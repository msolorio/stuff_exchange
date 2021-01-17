// Check if user is logged in. If not redirect
// to Welcome Page
function protectRoute(req, res, next) {
  if (!req.session.currentUser) {
    return res.redirect('/welcome');
  }

  next();
}

module.exports = protectRoute;

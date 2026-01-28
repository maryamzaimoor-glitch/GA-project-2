const mongoose = require("mongoose");

const admin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/sign-in")
  }

  if (!req.session.user.admin) {
    return res.send("Access denied: Admins only")
  }

    next(); 
}
module.exports = admin;

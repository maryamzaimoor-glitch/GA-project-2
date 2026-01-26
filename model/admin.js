const mongoose = require("mongoose");

const admin = (req, res, next) => {
  if (req.session.user && req.session.user.admin) {
    return next()
  }
  return res.send("Access denied: Admins only")
}

module.exports = admin;

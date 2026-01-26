const router = require("express").Router()
const Order = require("../model/order")
const admin = require("../model/admin")

router.get("/admin", admin, async (req, res) => {
  const orders = await Order.find({}).populate("user")
  res.render("admin-orders.ejs", { allOrders: orders })
})

module.exports = router

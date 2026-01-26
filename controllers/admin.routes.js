const router = require("express").Router()
const Order = require("../model/order")
const admin = require("../model/admin")
const isSignedIn = require("../middleware/is-signed-in")

router.get("/admin", admin, async (req, res) => {
  const orders = await Order.find({}).populate("user")
  res.render("admin-orders.ejs", { allOrders: orders })
})

// view all orders 
router.get("/orders", isSignedIn, async (req, res) => {
  try {
    const allOrders = await Order.find({ status: { $ne: "Cart" } }).populate("items.product")
    res.render("admin-orders.ejs", { allOrders })
  } catch (error) {
    console.log(error)
    res.send("Error loading admin orders")
  }
})

// update order status
router.post("/orders/:id/status", isSignedIn, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    })

    res.redirect("/admin/orders")
  } catch (error) {
    console.log(error)
    res.send("Error updating order status")
  }
})


module.exports = router

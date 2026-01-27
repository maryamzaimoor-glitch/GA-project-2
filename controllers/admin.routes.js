const router = require("express").Router()
const Order = require("../model/order")
const admin = require("../model/admin")
const isSignedIn = require("../middleware/is-signed-in")

router.get("/admin", admin, isSignedIn, admin, async (req, res) => {
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

router.get("/products", admin, async (req, res) => {
  const products = await Product.find()
  res.render("admin-products", {allProducts: products,user: req.session.user})
})

router.get("/products/:id", admin, async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.render("product-details", { product })
})

module.exports = router

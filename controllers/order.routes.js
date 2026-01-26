const express = require("express")
const router = express.Router()

const Order = require("../model/order")
const Product = require("../model/product")
const isSignedIn = require("../middleware/is-signed-in")

// cart
router.get("/cart", isSignedIn, async (req, res) => {
  try {
    const cart = await Order.findOne({
      user: req.session.user._id,
      status: "Cart",
    }).populate("items.product")

    res.render("cart.ejs", { cart })
  } catch (error) {
    console.log(error)
    res.send("Error loading cart")
  }
})

// adding to cart
router.post("/cart/add/:productId", isSignedIn, async (req, res) => {
  try {
    const userId = req.session.user._id
    const productId = req.params.productId

    let cart = await Order.findOne({ user: userId, status: "Cart" })

    if (!cart) {
      cart = await Order.create({
        user: userId,
        orderId: `${Date.now()}`,
        items: [],
        totalPrice: 0,
        status: "Cart",
      })
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    )

    if (existingItem) existingItem.quantity += 1
    else cart.items.push({ product: productId, quantity: 1 })

    await cart.save()
    res.redirect("/products")
  } catch (error) {
    console.log(error)
    res.send("Error adding to cart")
  }
})

// checkout
router.get("/new", isSignedIn, async (req, res) => {
  try {
    const cart = await Order.findOne({
      user: req.session.user._id,
      status: "Cart",
    }).populate("items.product")

    res.render("create-order.ejs", { cart })
  } catch (error) {
    console.log(error)
    res.send("Error loading create order page")
  }
})

// placing order, turn cart into Processing
router.post("/", isSignedIn, async (req, res) => {
  try {
    const cart = await Order.findOne({
      user: req.session.user._id,
      status: "Cart",
    }).populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.send("Cart is empty")
    }

    let total = 0
    cart.items.forEach((item) => {
      total += item.product.price * item.quantity
    })

    cart.customerName = req.body.customerName
    cart.phone = req.body.phone
    cart.address = req.body.address
    cart.totalPrice = total
    cart.status = "Processing"

    await cart.save()
    res.redirect("/orders")
  } catch (error) {
    console.log(error)
    res.send("Error placing order")
  }
})

//only user orders not cart
router.get("/", isSignedIn, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.session.user._id,
      status: { $ne: "Cart" },
    }).populate("items.product")

    res.render("all-orders.ejs", { allOrders: orders })
  } catch (error) {
    console.log(error)
    res.send("Error loading orders")
  }
})

// view order details
router.get("/:id", isSignedIn, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product")
    res.render("order-details.ejs", { orderDetails: order })
  } catch (error) {
    console.log(error)
    res.send("Error loading order details")
  }
})

// edit
router.get("/:id/edit", isSignedIn, async (req, res) => {
  try {
    const foundOrder = await Order.findById(req.params.id)
    res.render("edit-order.ejs", { foundOrder })
  } catch (error) {
    console.log(error)
    res.send("Error loading edit page")
  }
})

// update
router.put("/:id", isSignedIn, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, req.body)
    res.redirect(`/orders/${req.params.id}`)
  } catch (error) {
    console.log(error)
    res.send("Error updating order")
  }
})

// delete
router.delete("/:id", isSignedIn, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)
    res.redirect("/orders")
  } catch (error) {
    console.log(error)
    res.send("Error deleting order")
  }
})

module.exports = router

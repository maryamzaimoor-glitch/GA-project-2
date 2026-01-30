const router = require("express").Router()
const Order = require("../model/order")
const Product = require("../model/product")
const admin = require("../middleware/admin")
const isSignedIn = require("../middleware/is-signed-in")



// view all orders 
router.get("/orders", isSignedIn, admin, async (req, res) => {
  try {
    const allOrders = await Order.find({ status: { $ne: "Cart" } }).populate("user").populate("items.product")
    console.log(allOrders)
    res.render("admin-orders.ejs", {allOrders})
  } catch (error) {
    console.log(error)
    res.send("Error loading admin orders")
  }
})

// update order status
router.post("/orders/:id/status", isSignedIn, admin, async (req, res) => {
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

//views all products
router.get("/products", isSignedIn, admin, async (req, res) => {
  const products = await Product.find()
  res.render("admin-products.ejs", {allProducts: products,user: req.session.user})
})

//view details
router.get("/products/:id", isSignedIn, admin, async (req, res) => {
  const product = await Product.findById(req.params.id)
  console.log(product)

  if (!product) {
    return res.redirect("/admin/products")
  }

  res.render("product-details.ejs", { productDetails: product })
})
//edit
router.get("/products/:id/edit", isSignedIn, admin, async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.render("edit-product.ejs", { product })
})

//delete
router.post("/products/delete/:id", isSignedIn, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.redirect("/admin/products")
})



module.exports = router

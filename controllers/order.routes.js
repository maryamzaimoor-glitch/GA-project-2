const Order = require('../model/order');

const router = require('express').Router();


router.get("/new", (req, res) => {
  res.render("create-order.ejs")
})

//create orders 
router.post("/", async (req, res) => {
  try {
    const newOrder = {
      orderId: `${Date.now()}`,
      totalPrice: req.body.totalPrice,
      status: req.body.status,
      user: req.session.user._id,
      items: [],
    }

    await Order.create(newOrder)
    res.redirect("/orders")
  } catch (error) {
    console.log("Error creating order:", error)
    res.send("Error creating order")
  } 
})


// view all orders
router.get('/', async (req,res) =>{
    try{
        const orders = await Order.find({ user: req.session.user._id })
        res.render('all-orders.ejs', {allOrders: orders});
        }
    catch(error){
        console.log("Error", error);
    }     
})

// edit order
router.get("/:id/edit", async (req, res) => {
  try {
    const foundOrder = await Order.findById(req.params.id)
    res.render("edit-order.ejs", { foundOrder })
  } catch (error) {
    console.log("Error:", error)
    res.send("Error loading edit page")
  }
})


// update order
router.post("/update/:id", async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, req.body)
    res.redirect(`/orders/${req.params.id}`)
  } catch (error) {
    console.log("Error updating order:", error)
    res.send("Error updating order")
  }
})
const Product = require("../model/product")

router.post("/cart/add/:productId", async (req, res) => {
  try {
    const userId = req.session.user._id
    const productId = req.params.productId

    // find cart order for this user
    let cart = await Order.findOne({ user: userId, status: "Cart" })

    // if no cart, create one
    if (!cart) {
      cart = await Order.create({
        user: userId,
        orderId: `${Date.now()}`,
        items: [],
        totalPrice: 0,
        status: "Cart",
      })
    }

    //check if product already exists inside cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items.push({ product: productId, quantity: 1 })
    }

    await cart.save()

    res.redirect("/products")
  } catch (error) {
    console.log(error)
    res.send("Error adding to cart")
  }
})

// view order details
router.get('/:id', async (req,res)=>{
    try{
        const order = await Order.findById(req.params.id);
        res.render('order-details.ejs', {orderDetails: order});
    }
    catch(error){
        console.log("Error", error);
    }
})

// delete a product
router.post('/delete/:id', async (req,res)=>{
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    res.redirect('/orders');
})

module.exports = router;

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
        const orders = await Order.find({});
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

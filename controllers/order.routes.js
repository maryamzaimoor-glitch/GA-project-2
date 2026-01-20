const Order = require('../model/order');

const router = require('express').Router();



//create orders 
router.post('/', async (req, res) => {
    try{
        const createdOrder = await Order.create(req.body);
        res.redirect('/orders');
    }
    catch(error){
        console.log("Error creating order:", error);
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

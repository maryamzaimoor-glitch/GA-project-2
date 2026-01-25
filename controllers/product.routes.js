const express = require("express")
const router = express.Router()
const Product = require("../model/product")

//new product form
router.get("/new", (req, res) => {
  res.render("create-product.ejs")
})

//create products 
router.post('/', async (req, res) => {
    try{
        const loggedInUser = req.session.user._id;
        req.body.user = loggedInUser
        const createdProduct = await Product.create(req.body);
        res.redirect('/products');
    }
    catch(error){
        console.log("Error creating product:", error);
    }
    })

// edit product 
router.get("/:id/edit", async (req, res) => {
  try {
        const productToEdit = await Product.findById(req.params.id)
        res.render("edit-product.ejs", { productToEdit })
  } 
  catch (error){
        console.log("Error:", error)
        res.send("Error loading edit")
  }
})

//update product
router.post("/:id", async (req, res) => {
  try{
        await Product.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/products/${req.params.id}`)
  } 
  catch (error){
    console.log("Error updating product:", error)
    res.send("Error updating product")
  }
})

// view all products
router.get('/', async (req,res) =>{
    try{
        const products = await Product.find({});
        res.render('all-products.ejs', {allProducts: products});
        }
    catch(error){
        console.log("Error", error);
    }     
})

// view product details
router.get('/:id', async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.render('product-details.ejs', {productDetails: product});
    }
    catch(error){
        console.log("Error", error);
    }
})


// delete a product
router.post('/delete/:id', async (req,res)=>{
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
})

module.exports = router;

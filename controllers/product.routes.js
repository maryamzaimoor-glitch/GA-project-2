const Product = require('../model/product');

const router = require('express').Router();



//create products 
router.get('/new', async (req,res)=>{
    res.render('create-product.ejs')
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

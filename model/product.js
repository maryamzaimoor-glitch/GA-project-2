const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName:{
        type: String,
        required: true
    },
    productPrice:{
        type: Number,
        required: true
    },
    productOrigin:{
        type: String,
        required: true
    },
    productImage:{
        type: String,
        required: true
    },
    productRoast:{
        type: String,
        required: true
    },
    productSize:{
        type: String,
        required: true
    },  
    productDescription:{
        type: String,
        required: true
    },
    orderedBy: { //createdBy: req.session.user._id

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product;

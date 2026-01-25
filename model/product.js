const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    origin:{
        type: String,
        required: true
    },
    image:{
        type: String,
    },
    roast:{
        type: String,
        required: true
    },
    size:{
        type: String,
        required: true
    },  
    description:{
        type: String,
        required: true
    } 
})


const Product = mongoose.model("Product", productSchema)

module.exports = Product;

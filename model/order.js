const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId:{
        type: String,
        required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
    totalPrice:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true,
        default: 'Processing'
    },
    orderDate:{
        type: Date,
        required: true,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
      },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
    products: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }],
    shippingAddress: {
        type: String,
        required: true
      },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
      },
}, {timestamps: true});



module.exports = mongoose.model('orders',orderSchema);
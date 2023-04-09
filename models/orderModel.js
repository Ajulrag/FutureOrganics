const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const orderSchema = new Schema({
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
      name: {
          type: String,
          required: true
      },
      mobile: {
          type: Number,
          required: true
      },
      street: {
          type: String,
          required: true
      },
      locality: {
          type: String,
          required: true
      },
      city: {
          type: String,
          required: true
      },
      country: {
          type: String,
          required: true
      },
      state: {
          type: String,
          required: true
      },
      pincode: {
          type: Number,
          required: true
      }
    },
    orderAmount: {
      type: Number,
      required: true
    },
    expectedDeliveryDate: {
      type:Date
    },
    payment: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing','Placed','Ordered', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
      },
}, {timestamps: true});



module.exports = mongoose.model('orders',orderSchema);
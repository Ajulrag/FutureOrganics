const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new Schema({
    _id: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'users',
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    products:[{
      product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
          },
      quantity: {
          type: Number,
          default: 1,
          },
      price: {
          type: Number,
          required: true,
      }
    }],
    cartTotal: {
      type: Number
    }
})

module.exports = mongoose.model('carts',cartSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema = new Schema({
    _id: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'users',
      required: true
    },
    products:[{
      proId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
          },
      name: {
        type: String,
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
      },
      image:{
          type: String,
          ref: "products",
          required: true
      },
      isAdded: {
        type: Boolean,
        default: true
      }
    }],
    // cartTotal: {
    //   type: Number,
    //   required: true
    // }
})

module.exports = mongoose.model('carts',cartSchema);
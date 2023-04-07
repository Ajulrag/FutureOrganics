const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'products'
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
})

module.exports = mongoose.model('wishlists',wishlistSchema);
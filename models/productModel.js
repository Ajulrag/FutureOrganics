const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const productSchema = new Schema({
    product: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"categories",
        required: true
    },
    image: [{
        img:{type: String,
        required: true}
    }],
    price: {
        type: Number,
        required: true,
        default: 0
    },
    stock: {
        type: Number,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "List"
    },
    isDelete: {
        type: String,
        default: false
    },
   
    
}, {timestamps: true})

module.exports = mongoose.model("products",productSchema);
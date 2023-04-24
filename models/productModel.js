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
    image0: {
        type: String,
        required: true
    },
    image1: {
        type: String,
        
    },
    image2: {
        type: String,
        
    },
    image3: {
        type: String,
        
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    offer: { 
        type: Number,
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
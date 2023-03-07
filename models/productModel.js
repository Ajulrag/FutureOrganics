const { default: mongoose } = require("mongoose");
const   Schema = mongoose.Schema;


const productSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    category: {
        type: String,
        ref:"Category",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "List"
    }
    
})

module.exports = mongoose.model("products",productSchema);
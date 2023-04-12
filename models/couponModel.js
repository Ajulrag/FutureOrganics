const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    status: {
        type: String,
        default: 'active'
    },
    expiry:{
        type: Date,
        require: true
    },
    discount:{
        type: Number,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('coupon', couponSchema)
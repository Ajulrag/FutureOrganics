const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const addressSchema = new Schema({
    _id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    addresses: [{
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
    }]
});


module.exports = mongoose.model('addresses',addressSchema);
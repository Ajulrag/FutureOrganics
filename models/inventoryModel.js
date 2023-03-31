const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const inventorySchema = new Schema({
    product:{
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    quantity:{
        type: String
    }
});


module.exports = mongoose.model('inventories',inventorySchema);
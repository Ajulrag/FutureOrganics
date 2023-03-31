const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category: {
        type:String,
        unique: true,
        required:true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    isdelete: {
        type: Boolean,
        default: true,

    },
    status: {
        type: String,
        default: "list",
    }
});


module.exports = mongoose.model("categories",categorySchema);
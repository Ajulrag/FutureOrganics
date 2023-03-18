const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    image:{
        type: String,
        trim: true
    }
})

module.exports = mongoose.model("images", imageSchema);
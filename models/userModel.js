const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
  
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default:"Unblocked"
  },
  address: {
    type: String
  }
 
});

module.exports = mongoose.model("users", userSchema);

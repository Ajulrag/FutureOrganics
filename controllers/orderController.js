const Product = require("../models/productModel");
const Category = require('../models/categoryModel');


//GETTING ORDER MANAGMENT PAGE
const getOrders = async (req,res,next) => {
    try {
        res.render('admin/orders');
    } catch (error) {
        next();
    }
}

module.exports = {
     getOrders
}
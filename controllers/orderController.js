const Order = require("../models/orderModel");
const Category = require('../models/categoryModel');


//GETTING ORDER MANAGMENT PAGE
const getOrders = async (req,res,next) => {
    try {
        if(req.session.admin_id) {
            const orderList = await Order.find().populate('customer').populate('products.product');
       console.log(orderList);
        res.render('admin/orders',{orderList});
    }else{
        res.redirect("/adminLogin");
    }
    } catch (error) {
        next();
    }
}

//GETTING EDIT ORDER MANAGMENT PAGE
const getEditOrder = async (req,res,next) => {
    try {
        const id = req.params.id;
        const orderData = await Order.findById(id);
        console.log(orderData);
        if(orderData){
            res.render('admin/editOrder',{orderData})
        }
        else{
            res.redirect('admin/orders');
        }
    } catch (error) {
        next();
    }
}

module.exports = {
     getOrders,
     getEditOrder
}
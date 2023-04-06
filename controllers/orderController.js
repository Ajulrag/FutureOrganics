const Order = require("../models/orderModel");



//GETTING ADMIN ORDER MANAGMENT PAGE
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

//GETTING ADMIN EDIT ORDER MANAGMENT PAGE
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


//DOING EDIT ORDER
const doEditorder = async(req,res,next) => {
    try {
        const id = req.params.id;

        const orderData = await Order.updateOne({_id:id},req.body);
        if(orderData){
            res.redirect("/admin/orders")
        }else{
            res.redirect("/admin/editorder");
        }
    } catch (error) {
        next()
    }
}

module.exports = {
     getOrders,
     getEditOrder,
     doEditorder
}
const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const Order = require('../models/orderModel');
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");



//GETTING ADMIN LOGIN PAGE
const getLogin = async (req, res,next) => {
  try {
    if(req.session.admin_id){
      res.redirect("/admin/dashboard"); 
    }
    else{
      res.render('admin/adminlogin');
    }
  } catch (error) {
    next(error);
  }
};


//DO LOGIN
const doLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const adminData = await Admin.findOne({ email: email });
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch) {
        req.session.admin_id = adminData._id
        res.redirect("/admin/dashboard");
      } else {
        res.render  ("admin/adminlogin", { message: "Incorrect password" });
      }
    } else {
      res.render("admin/adminlogin", { message: "No user found" });
    }
  } catch (error) {
    next(error);
  }
};


//GET ADMIN DASHBOARD
const getDashboard = async(req,res,next) => {
  try {
    let adminSession = req.session.admin_id;
    if(req.session.admin_id){
    
      const totalDelivery = (await Order.find({ status: "Delivered"})).length;
      const totalOrder = (await Order.find()).length;
      const totalUsers = (await User.find()).length;
      const category = (await Category.find()).length;
      const products = (await Product.find()).length;

      const sale = await Order.find().count();
      const Ordered = await Order.find({status:"Ordered"}).count();
      const Shipped = await Order.find({status:"Shipped"}).count();
      const InTransist = await Order.find({status:"In Transist"}).count();
      const Delivered = await Order.find({status:"Delivered"}).count();
      const Cancelled = await Order.find({status:"Cancelled"}).count();
      const ReturnProcessing = await Order.find({status:"Return Processing"}).count();
      const Returned = await Order.find({status: "Returned"});

    const orderList = await Order.find().populate('customer').populate('products.product');


    res.render("admin/dashboard",{adminSession,orderList,totalDelivery,totalOrder,totalUsers,category,products,
                                  sale,Ordered,Shipped,InTransist,Delivered,Cancelled,ReturnProcessing,Returned}); 

    } else {
      res.redirect("/admin")
    }
  } catch (error) {
    next(error);
  }
}


//LOGGING OUT
const doLogout = async(req,res,next) => {
  try {
    req.session.admin_id="";
  res.redirect("/admin");
  console.log("session destroyed");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLogin,
  doLogin,
  getDashboard,
  doLogout,
};

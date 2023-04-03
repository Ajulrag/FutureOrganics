const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const Order = require('../models/orderModel');



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
    let adminSession = req.session.admin_id
    const orderList = await Order.find().populate('customer').populate('products.product');
    res.render("admin/dashboard",{adminSession,orderList})  
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

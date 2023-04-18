const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const Order = require('../models/orderModel');
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");



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

      const OrderData = await Order.find();


    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const dates = dailyOrders.map((order) => order._id);
    const counts = dailyOrders.map((order) => order.count);
    console.log(dates);
    console.log(counts);
    res.render("admin/dashboard",{adminSession,orderList,totalDelivery,totalOrder,totalUsers,category,products,
                                  sale,Ordered,Shipped,InTransist,Delivered,Cancelled,ReturnProcessing,Returned,dailyOrders,OrderData,dates,counts}); 

    } else {
      res.redirect("/admin")
    }
  } catch (error) {
    next(error);
  }
}


//GETTING ALL COUPONS
const getCoupons = async (req,res,next) => {
  try {
    if(req.session.admin_id) {
      const couponList = await Coupon.find().sort({createdAt: -1});
      res.render('admin/coupons',{couponList});
    } else {
      res.redirect("/adminLogin");
    }
  } catch (error) {
    next();
  }
}

//GETTING ADD COUPON PAGE
const getAddCoupon =async (req,res,next) => {
  try {
    if (req.session.admin_id) {
    res.render('admin/addCoupon',{ message: req.flash("error2") });
  } else {
    res.redirect("/admin/coupons");
}
  } catch (error) {
    next();
  }
}

//ADDING COUPONS
const addCoupon = async(req,res,next) => {
  
  try {
    const date = req.body.expiry.split('/');
    const newDate = `${date[2]}-${date[0]}-${date[1]}`
    await Coupon.create({
      code: req.body.code.toUpperCase(),
      status: req.body.status,
      expiry: newDate,
      discount: req.body.discount,
      minimum_purchase: req.body.minimum_purchase,
    });
   
    res.redirect('/admin/coupons')
  } catch (error) {
    req.flash("error2","This Coupon is already exist");
    res.redirect("/admin/coupons/addcoupon");
    console.log(error)
   
  }
}

//GETTING EDIT COUPON PAGE
const getEditCoupon = async(req,res,next) => {
  try {
    const id = req.params.id;
    const couponData = await Coupon.findById(id);
    if(couponData) {
      res.render("admin/editCoupon",{couponData,message:req.flash("error2")});
    } else {
      res.redirect('/admin/coupons');
    }
    
  } catch (error) {
    next();
  }
}

//EDIT COUPON
const editCoupon = async(req,res,next) => {
  const id=  req.params.id;
  try {
    
   req.body.code = req.body.code.toUpperCase(); 
    const couponData = await Coupon.findByIdAndUpdate({_id:id},req.body);
    if(couponData) {
      res.redirect('/admin/coupons');
    } else {
      res.redirect('/admin/editcoupon');
    }
  } catch (error) {
    req.flash('error2',"Coupon Code already exist!! Try another...");
    res.redirect(`/admin/coupons/editcoupon/${id}`);
  }
}

//DELETE COUPON
const deleteCoupon = async(req,res,next) => {
  try {
    const coupon = await Coupon.deleteOne({ id: req.params.id })
    if(coupon) {
      res.redirect('/admin/coupons');
    }
  } catch (error) {
    next(error);
  }
}


//GETTING SALES REPORTS
const getSalesReports = async(req,res,next) => {
  try {
    const orderList = await Order.find().populate('customer').populate('products.product').sort({createdAt: -1});
    console.log(orderList);
    res.render('admin/sales',{orderList});
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
  getSalesReports,
  getCoupons,
  getAddCoupon,
  addCoupon,
  getEditCoupon,
  editCoupon,
  deleteCoupon,
  doLogout,
};

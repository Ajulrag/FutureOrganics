const express = require("express");
const adminRoute = express();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");


// /admin/dashboard

adminRoute.get("/",adminController.getLogin);
adminRoute.post("/", adminController.doLogin);
adminRoute.get("/dashboard",adminAuth.isLogin,adminController.getDashboard)
adminRoute.get("/adminLogout",adminAuth.isLogin,adminController.doLogout);
adminRoute.get("/sales",adminAuth.isLogin,adminController.getSalesReports);
adminRoute.get("/coupons",adminAuth.isLogin,adminController.getCoupons);
adminRoute.get("/coupons/addcoupon",adminAuth.isLogin,adminController.getAddCoupon);
adminRoute.post('/coupons/addcoupon',adminAuth.isLogin,adminController.addCoupon);
adminRoute.get("/coupons/editcoupon/:id",adminAuth.isLogin,adminController.getEditCoupon);
adminRoute.post("/coupons/editcoupon/:id",adminAuth.isLogin,adminController.editCoupon);
adminRoute.get("/coupons/deletecoupon/:id",adminAuth.isLogin,adminController.deleteCoupon);



module.exports = adminRoute;

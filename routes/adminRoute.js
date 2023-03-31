const express = require("express");
const adminRoute = express();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");


// /admin/dashboard

adminRoute.get("/",adminController.getLogin);
adminRoute.post("/", adminController.doLogin);
adminRoute.get("/dashboard",adminAuth.isLogin,adminController.getDashboard)
adminRoute.get("/adminLogout",adminAuth.isLogin,adminController.doLogout);



module.exports = adminRoute;

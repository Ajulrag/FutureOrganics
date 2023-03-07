const express = require("express");
const admin_route = express();
const adminController = require("../controllers/adminController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const adminAuth = require("../middlewares/adminAuth");
const multer = require('multer');




admin_route.get("/adminLogin",adminController.getLogin);
admin_route.post("/adminLogin", adminController.doLogin);
admin_route.get("/dashboard",adminAuth.isLogin,adminController.getDashboard)
admin_route.get("/adminLogout",adminAuth.isLogin,adminController.doLogout);

//Category managment
admin_route.get("/categories",adminAuth.isLogin,categoryController.getCategory);
admin_route.get("/category",adminAuth.isLogin,categoryController.getaddCategory);
admin_route.post("/category",adminAuth.isLogin,categoryController.addCategory);
admin_route.get("/editcategory/:id",adminAuth.isLogin,categoryController.getEditCategory);
admin_route.post("/editcategory/:id",adminAuth.isLogin,categoryController.editCategory);

// //Product managment
admin_route.get("/products",adminAuth.isLogin,productController.getProductmanagment);
admin_route.get("/addproduct",adminAuth.isLogin,productController.getAddproducts);
admin_route.post("/addproduct",adminAuth.isLogin,productController.upload.single('image'),productController.addProducts);
admin_route.get("/editproduct/:id",adminAuth.isLogin,productController.getEditProduct);
admin_route.post("/editproduct/:id",adminAuth.isLogin,productController.upload.single('image'), productController.editProduct);




module.exports = admin_route;

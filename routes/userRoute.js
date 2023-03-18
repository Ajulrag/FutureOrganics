const express = require("express");
const user_route = express();
const userController = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");

user_route.get("/",userController.getHomepage);

user_route.get("/registration",userAuth.isLogin, userController.getRegister);
user_route.post("/registration", userController.otpvalidation);

user_route.get("/otp", userAuth.isLogin, userController.getotp);
user_route.post("/otp", userController.verifyOtp);
user_route.get('/resendotp',userAuth.isLogin, userController.resendOtp);

user_route.get("/login", userController.getLogin);
user_route.post("/login", userController.doLogin);

user_route.get("/logout", userController.doLogout);

user_route.get("/singleproduct/:id",userAuth.isLogin,userController.getSingleProduct);
user_route.get('/getallproducts',userAuth.isLogin, userController.getAllProducts);

user_route.get('/cart',userAuth.isLogin,userController.getCart)
user_route.post('/addtocart/:id',userController.addToCart);


user_route.get('/cart/checkout',(req,res) => {
    res.render('users/checkout')
})

user_route.get('/profile',(req,res) => {
    res.render('users/userprofile')
})



module.exports = user_route;

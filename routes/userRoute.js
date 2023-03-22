const express = require("express");
const user_route = express();
const userController = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");

user_route.get("/",userController.getHomepage);
user_route.get("/registration",userController.getRegister);
user_route.post("/registration", userController.otpvalidation);
user_route.get("/otp", userController.getotp);
user_route.post("/otp", userController.verifyOtp);
user_route.get('/resendotp', userController.resendOtp);
user_route.get("/login", userController.getLogin);
user_route.post("/login", userController.doLogin);
user_route.get("/logout", userController.doLogout);
user_route.get("/singleproduct/:id",userController.getSingleProduct);
user_route.get('/getallproducts', userController.getAllProducts);
user_route.get('/cart',userAuth.isLogin,userController.getCart)
user_route.post('/addtocart/:id',userController.addToCart);
user_route.get('/profile',userAuth.isLogin,userController.getProfile);

user_route.get('/addaddress',userAuth.isLogin,userController.getAddAddress);
user_route.post('/addaddress',userAuth.isLogin,userController.doAddAddress);

user_route.get('/404',(req,res) => {
    res.render('users/404')
})




module.exports = user_route;

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
user_route.post('/addtocart/:id',userAuth.isLogin,userController.addToCart);
user_route.post('/cart/update',userAuth.isLogin,userController.updateCart);
user_route.get('/cart/remove/:id',userAuth.isLogin,userController.removeFromCart);

user_route.get('/profile',userAuth.isLogin,userController.getProfile);
user_route.post('/profile/updateuser/:id',userAuth.isLogin,userController.updateUser);

user_route.get('/cart/checkout',userAuth.isLogin,userController.getCheckout);

user_route.post('/cart/checkout',userAuth.isLogin,userController.placeOrder);

user_route.get('/codsuccess',userAuth.isLogin,userController.getcodSuccess);
user_route.post('/onlinesuccess',userAuth.isLogin,userController.getonlineSuccess);

user_route.post('/verify-razorpay',userAuth.isLogin,userController.verifyRazorpay)


user_route.get('/profile/address',userAuth.isLogin,userController.getAddress);
user_route.get('/profile/addaddress',userAuth.isLogin,userController.getAddAddress);
user_route.post('/profile/addaddress',userAuth.isLogin,userController.doAddAddress);
user_route.get('/profile/orders',userAuth.isLogin,userController.getOrders);
user_route.get('/profile/orders/cancelorder/:id',userAuth.isLogin,userController.cancelOrder);
user_route.get('/profile/orders/returnorder/:id',userAuth.isLogin,userController.returnOrder);


user_route.get('/profile/wishlist',userAuth.isLogin,userController.getWishlist);
user_route.post('/addtowishlist/:id',userAuth.isLogin,userController.addToWishlist);
user_route.get('/profile/wishlist/remove/:id',userAuth.isLogin,userController.removeFromWishlist);

user_route.get('/search-products',userController.searchProduct);

user_route.post('/cart/checkout/applycoupon',userAuth.isLogin,userController.applyCoupon);



module.exports = user_route;

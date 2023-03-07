const express = require("express");
const user_route = express();
const userController = require("../controllers/userController");
const userAuth = require("../middlewares/userAuth");

user_route.get("/", userController.getHomepage);

user_route.get("/registration", userController.getRegister);
user_route.post("/registration", userController.otpvalidation);

user_route.get("/otp", userAuth.isLogin, userController.getotp);
user_route.post("/otp", userController.verifyOtp);

user_route.get("/login", userController.getLogin);
user_route.post("/login", userController.doLogin);

user_route.get("/logout", userController.doLogout);



module.exports = user_route;

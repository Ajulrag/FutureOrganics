const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Email = process.env.EMAIL;
const Password = process.env.EMAILPASS;
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');


//SECURING PASSWORD
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    next(error);
  }
};



//NODE MAILER
const transporter = nodemailer.createTransport({
  host:"smtp.gmail.com",
  port:465,
  auth:{
    user:Email,
    pass:Password,
  },
     
});



//GETTING USER REGISTER PAGE
const getRegister = async (req, res,next) => {
  try {
    if(req.session.user){
      res.redirect("/");
    }else{
      res.render("users/registration");
    }
    
  } catch (error) {
    next(error);
  }
};



//GETTING OTP PAGE
const getotp = async (req,res,next) => {
  try {
    res.redirect('/otp');
  } catch (error) {
    next(error);
  }
}


//OTP VALIDATION
const otpvalidation = async (req,res,next) => {
  try {
     req.session.name = req.body.name,
     req.session.email =req.body.email,
     req.session.mobile =req.body.mobile,
     req.session.password = req.body.password

     const checkUser = await User.findOne({ email: req.session.email })
     
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  req.session.otp = otp;
     
     if(!checkUser) {
      var mailFormat = {
        from: "futureorganics0@gmail.com",
        to:req.body.email,
        subject:"OTP for registration",
        html:"<h3>OTP for account verification is </h3>" +"<h1 style='font-weight:bold;'>" +otp+"</h1>"

      }
      
      transporter.sendMail(mailFormat, (error,data) => {
        if(error) {
          return console.log(error);
        }else{
          res.render("users/otp");
        }
      })
     } else {
      res.render("users/registration", {message:"We are sorry,this email login is already exist. Try another email address"});
     }
  } catch (error) {
    next(error);
  }
}


//otp verification 
const verifyOtp = async (req,res,next) => {
  try {
    if (req.body.otp == req.session.otp) {
      const securedPassword = await securePassword(req.session.password,10)
      const user = new User({
        name: req.session.name,
        email: req.session.email,
        mobile:req.session.mobile,
        password: securedPassword
      })
      const userData = await user.save();
      if(userData) {
        res.render("users/login",{ succesmessage: "Your registration has been succesfull"})
      } else {
        res.re("users/registration",{message:"Registration failed!!!"});
      }
    }else{
      res.render("users/otp",{message:"Invalid OTP"})
      console.log(error.message);
    }
  } catch (error) {
    next(error);
  }
}



//RESEND OTP
const resendOtp = async (req,res,next) => {
  try {
      var otp = Math.random();
      otp = otp * 1000000;
      otp = parseInt(otp);
      req.session.otp = otp;

    const mailFormat = {
      from: "futureorganics0@gmail.com",
      to:req.session.email,
      subject:"OTP for registration",
      html:"<h3>OTP for account verification is </h3>" +"<h1 style='font-weight:bold;'>" +otp +"</h1>"
    }
    transporter.sendMail(mailFormat, (error,data) => {
      if(error) {
        return console.log(error);  
      }else{
        res.render("users/otp");
      }
    })
  } catch (error) {
    next(error);
  }
}

//GETTING USER HOME PAGE
const getHomepage = async (req, res,next) => {
  try {
    let usersession = req.session.user;
    let user = req.session.name;
    const productlist = await Product.find({isDelete:false}).populate({path:'category', model:'categories'});
    res.render('users/home',{usersession,productlist,user});
  } catch (error) {
    next(error);
  }
};


//GETTING USER LOGIN PAGE
const getLogin = async (req, res,next) => {
  try {
    if (req.session.user) {
      res.redirect('/');
    } else {
      const message = req.session.error
      delete req.session.error
      res.render('users/login', {message});
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
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.status == "Unblocked") {
          req.session.user = userData;
          res.redirect("/");
        } else {
          req.session.error = 'This website has preventsed you from browsing this URL.For more informatiion visit the help center'
          res.redirect('/login');
          console.log("preventsed");
        }
        
      } else {
        res.render("users/login", { message: "Password is incorrect" });
        console.log("password thett");
      }
    } else {
      res.render("users/login", { message: "No user found" });
      console.log("catchile error");
    }
  } catch (error) {
    next(error);
  }
};


//GETING PROFILE PAGE
const getProfile = async (req,res,next) => {
  try {
    const user = req.session.user;
    if(user){
      res.render('users/userprofile',{user})
    }
  } catch (error) {
    next(error);
  }
}


//LOGGING OUT
const doLogout = async(req,res,next) => {
    try {
      req.session.destroy();
      res.redirect('/login');
    } catch (error) {
      next(error);
    }
}


//GET SINGLE PRODUCT VIEW
const getSingleProduct = async (req,res,next) => {
  try {
    let usersession = req.session.user;
    const id = req.params.id;
    const product = await Product.findById(id);
    console.log(product);
    res.render('users/singleProduct',{product,usersession});
  } catch (error) {
    next(error);
  }
}


//GET ALL PRODUCTS
const getAllProducts= async (req,res,next) => {
  try {
    const productList = await Product.find({isDelete: false});
    let usersession = req.session.user;
    res.render('users/allProducts',{productList , usersession});
  } catch (error) {
    next(error);
  }
}


//GET CART PAGE
const getCart = async (req,res,next) => {
  try {
    const { user_id } = req.session;
    const cartData = await Cart.findOne({ user_id }).populate('products.product_id')

    if(cartData) {
      res.render('users/cart',{cartData});
    } else {
      res.send("Emptyy cart")
    }
    
  } catch (error) {
    next(error);
  }
}

//ADD TO CART
const addToCart = async(req,res, next) => {
  try {
    const id = req.params.id;
    const { product_id, user_id } = req.body;
    const userCart =  await Cart.findById({user_id})
    if(userCart){
      Cart.updateOne(
        {user_id},
        {$push: { products: { product_id, quantity, price }}}
        )
        res.json({})
      } else {
        const cart = new Cart({
          products:{ product_id, quantity, price },
          _id:{ user_id }
      });
      const cart_data = await cart.save();
      res.json({})
      
      }  
  } catch (error) {
    // res.json(error)
    next(error);
  }
}


//GETTING ADD ADDRESS PAGE
const getAddAddress = async(req,res,next) => {
  try {
    let usersession = req.session.user;
    res.render('users/addAddress',{usersession})
  } catch (error) {
    next(error);
  }
}

//ADD NEW ADDRESS
const doAddAddress = async (req,res) => {
  try {
    
  } catch (error) {
    nest(error);
  }
}

module.exports = {
  getHomepage,
  getRegister,
  getotp,
  otpvalidation,
  verifyOtp,
  resendOtp,
  getLogin,
  doLogin,
  getProfile,
  doLogout,
  getSingleProduct,
  getAllProducts,
  getCart,
  addToCart,
  getAddAddress,
  doAddAddress
};

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
    console.log(error.message);
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
const getRegister = async (req, res) => {
  try {
    if(req.session.user_id){
      res.redirect("/");
    }else{
      res.render("users/registration");
    }
    
  } catch (error) {
    console.log(error.message);
  }
};



//GETTING OTP PAGE
const getotp = async (req,res) => {
  try {
    res.redirect('/otp');
  } catch (error) {
    console.log(error.message);
  }
}


//OTP VALIDATION
const otpvalidation = async (req,res) => {
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
    console.log(error.message);
  }
}


//otp verification 
const verifyOtp = async (req,res) => {

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
    
    console.log(error.message)
  }
}



//RESEND OTP
const resendOtp = async (req,res) => {
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
    console.log(error.message);
  }
}

//GETTING USER HOME PAGE
const getHomepage = async (req, res) => {
  try {
    let usersession = req.session.user_id;
    let user = req.session.name;
    const productlist = await Product.find({isDelete:false}).populate({path:'category', model:'categories'});
    console.log(productlist);
    res.render('users/home',{usersession,productlist,user});
  } catch (error) {
    console.log(error.message);
  }
};


//GETTING USER LOGIN PAGE
const getLogin = async (req, res) => {
  try {
    if (req.session.user_id) {
      res.redirect('/');
    } else {
      res.render('users/login');
    }
  } catch (error) {
    console.log(error.message);
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
        // if (userData.verified) {
          req.session.user_id = userData._id;
          res.redirect("/");
        // } else {
        //   req.session.error = 'This website has preventsed you from browsing this URL.For more informatiion visit the help center'
        //   res.redirect('/login');
        // }
        
      } else {
        res.render("users/login", { message: "Password is incorrect" });
      }
    } else {
      res.render("users/login", { message: "No user found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};



//LOGGING OUT
const doLogout = async(req,res) => {
    try {
      req.session.destroy();
      res.redirect('/login');
    } catch (error) {
      console.log(error.message);
    }
}


//GET SINGLE PRODUCT VIEW
const getSingleProduct = async (req,res) => {
  try {
    let usersession = req.session.user_id;
    const id = req.params.id;
    const product = await Product.findById(id);
    console.log(product);
    res.render('users/singleProduct',{product,usersession});
  } catch (error) {
    console.log(error.message);
  }
}


//GET ALL PRODUCTS
const getAllProducts= async (req,res) => {
  try {
    const productList = await Product.find({isDelete: false});
    let usersession = req.session.user_id;
    res.render('users/allProducts',{productList , usersession});
  } catch (error) {
    console.log(error.message);
  }
}

//GET CART PAGE
const getCart = async (req,res) => {
  try {
    const { user_id } = req.session;
    const cartData = await Cart.findOne({ user_id }).populate('products.product_id')

    if(cartData) {
      res.render('users/cart',{cartData});
    } else {
      res.send("Emptyy cart")
    }
    
  } catch (error) {
    console.log(error)
  }
}

//ADD TO CART
const addToCart = async(req,res) => {
  try {
    const { product_id, quantity, price } = req.body;
    const { user_id } = req.session;

    const userCart =  await Cart.findById({user_id})

    if(userCart){
      Cart.updateOne(
        {user_id},
        {$push: { products: { product_id, quantity, price }}},
        { upsert: true, new: true },
        )
        res.redirect('/users/products');

      }   
  } catch (error) {
    console.log(error);
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
  doLogout,
  getSingleProduct,
  getAllProducts,
  getCart,
  addToCart,


};

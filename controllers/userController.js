const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Email = process.env.EMAIL;
const Password = process.env.EMAILPASS;


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
  }
});

  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);




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
    console.log(process.env.EMAIL);
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
     
     if(!checkUser) {
      var mailFormat = {
        from: "futureorganics0@gmail.com",
        to:req.body.email,
        subject:"OTP for registration",
        html:"<h6> OTP for account verification is" + otp + "</h6>"

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
    
    if (req.body.otp == otp) {
      const securedPassword = await securePassword(req.session.password,10)

      const user = new User({
        name: req.session.name,
        email: req.session.email,
        mobile:req.session.mobile,
        password: securedPassword
      })

      const userData = await user.save();
      console.log(userData);
      console.log("Userdata is succesfully saved");

      if(userData) {
        console.log("Your registration has been succesfull");
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

//GETTING USER HOME PAGE
const getHomepage = async (req, res) => {
  try {
    let usersession = req.session.user_id;
    res.render('users/home',{usersession});
    console.log(usersession,"userSESSION");
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
        req.session.user_id = userData._id;
        res.redirect("/");
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



module.exports = {
  getHomepage,
  getRegister,
  getotp,
  otpvalidation,
  verifyOtp,
  getLogin,
  doLogin,
  doLogout
};

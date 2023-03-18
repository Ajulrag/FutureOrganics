const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const session = require("express-session");



//SECURING PASSWORD
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};




//GETTING ADMIN LOGIN PAGE
const getLogin = async (req, res) => {
  try {
    if(req.session.admin_id){
      res.redirect("/admin/dashboard"); 
    }
    else{
      res.render('admin/adminlogin');
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
    const adminData = await Admin.findOne({ email: email });
    
    if (adminData) {
      const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (passwordMatch) {
        req.session.admin_id = adminData._id
        res.redirect("/admin/dashboard");
      } else {
        res.render  ("admin/adminlogin", { message: "Incorrect password" });
      }
    } else {
      res.render("admin/adminlogin", { message: "No user found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};


//GET ADMIN DASHBOARD
const getDashboard = async(req,res) => {
  try {
  let adminSession = req.session.admin_id
   res.render("admin/dashboard",{adminSession})  
  } catch (error) {
    console.log(error.message);
  }
}


//LOGGING OUT
const doLogout = async(req,res) => {
  try {
    req.session.admin_id="";
  res.redirect("/admin");
  console.log("session destroyed");
  } catch (error) {
    console.log(error.message);
  }
}










module.exports = {
  getLogin,
  doLogin,
  getDashboard,
  doLogout,
};

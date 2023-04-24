const User = require('../models/userModel');



//GET USERMANAGMENT PAGE
const getUserManagment = async (req,res,next) => {
    try {
        const userlist = await User.find().sort({createdAt: -1});
        res.render('admin/users',{userlist});
    } catch (error) {
        next(error);
    }
}


//GET ADD USER PAGE
const getAddUser = async (req,res,next) => {
    try {
        res.render('admin/adduser');
    } catch (error) {
    }
}


//ADDING USER
const addUser = async (req,res,next) => {
    try {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password:req.body.password,
            verified: req.body.verified,
        })
        res.redirect('/admin/usermanagment');
    } catch (error) {
        next(error);
    }
}

//GETTING EDIT USER PAGE
const getEditUSer = async (req,res,next) => {
    try {
        const id = req.params.id;
        const userData = await User.findById(id);
        if(userData){
            res.render('admin/editUSer',{userData})
        }else{
            res.redirect('/admin/users')
        }  
    } catch (error) {
        next(error);
    }
}

//EDIT USER
const editUser = async (req,res,next) => {
    const id = req.params.id;
    try{
        const userData = await User.updateOne({_id:id},req.body);
        if(userData){
            req.flash("Success", "User updated succesfully")
            res.redirect("/admin/usermanagment")
        }else{
            res.flash("error", "User updation failed!!!")
            res.redirect("/admin/edituser");
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUserManagment,
    getAddUser,
    addUser,
    getEditUSer,
    editUser
}

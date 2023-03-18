const User = require('../models/userModel');



//GET USERMANAGMENT PAGE
const getUserManagment = async (req,res) => {
    try {
        const userlist = await User.find();
        res.render('admin/users',{userlist});
    } catch (error) {
        console.log(error.message);
    }
}


//GET ADD USER PAGE
const getAddUser = async (req,res) => {
    try {
        res.render('admin/adduser');
    } catch (error) {
        console.log(error.message);
    }
}


//ADDING USER
const addUser = async (req,res) => {
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
        console.log(error);
    }
}

//GETTING EDIT USER PAGE
const getEditUSer = async (req,res) => {
    try {
        const id = req.params.id;
        const userData = await User.findById(id);
        if(userData){
            res.render('admin/editUSer',{userData})
        }else{
            res.redirect('/admin/users')
        }  
    } catch (error) {
        console.log(error.message);
    }
}

//EDIT USER
const editUser = async (req,res) => {
    const id = req.params.id;
    try{

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getUserManagment,
    getAddUser,
    addUser,
    getEditUSer
}

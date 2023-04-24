const User = require("../models/userModel");


const   isLogin = async(req,res,next) => {
    try {
        const user = await User.findOne({_id:req.session.user});
        if(req.session.user){
            const block = user.status;
            if(block == "Blocked"){
                req.session.destroy();
                res.redirect('/login');
            } else {
                next();
            }
        }
        else{
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    isLogin
}
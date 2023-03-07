const isLogin = async (req,res,next) => {

  try {
    if(req.session.admin_id){
      next();
    }
    else{
      console.log(req);
      res.redirect('/admin/adminLogin'); 
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  isLogin,
};

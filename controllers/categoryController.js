const Category = require("../models/categoryModel");



//GETTING CATEGORY MANAGMENT
const getCategory = async (req, res,next) => {
  try {
    if (req.session.admin_id) {
      const categoryList = await Category.find();
      res.render("admin/categories", { categoryList });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    next(error);
  }
};

//GETTING ADD CATEGOGORY
const getaddCategory = async (req, res,next) => {
  try {
    if (req.session.admin_id) {
      res.render("admin/addCategory", { message: req.flash("error") });
    } else {
      res.redirect("/admin/categories");
    }
  } catch (error) {
    next(error);
  }
};


//ADDING NEW CATEGORY
const addCategory = async (req, res,next) => {
  try {
    await Category.create({
      category: req.body.category.toLowerCase(),
      description: req.body.description,
    })
    res.redirect("/admin/categories");
  } catch(error) {
    req.flash("error", "This category is already exist");
    res.redirect("/admin/categories/addcategory");
  }
};

//GET EDIT CATEGORY
const getEditCategory = async (req,res,next) => {
  try {
    const id = req.params.id;
    const categoryData = await Category.findById(id);
    if(categoryData){
      res.render("admin/editCategory",{category:categoryData,message:req.flash("error")});
    }else{
      res.redirect("/admin/categories");
    }
  } catch (error) {
    next(error);
  }
}
//EDITING CATEGORY
const editCategory = async (req,res,next) => {
  const id = req.params.id;
  try {
    req.body.category = req.body.category.toLowerCase();
    const categoryData = await Category.updateOne({_id:id},req.body);
    if(categoryData){
      req.flash("Success", "Ctegory updated succesfully");
      res.redirect("/admin/categories");
    }
    else{
      req.flash("error", "Category updation failed");
      res.redirect("/admin/editcategory");
    }
  } catch (error) {
    req.flash("error", "Category Already exist!");
    res.redirect(`/admin/editcategory/${id}`);
  }
} 


module.exports = {
  getCategory,
  getaddCategory,
  addCategory,
  getEditCategory,
  editCategory
};

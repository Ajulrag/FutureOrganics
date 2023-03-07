const Category = require("../models/categoryModel");



//GETTING CATEGORY MANAGMENT
const getCategory = async (req, res) => {
  try {
    
    if (req.session.admin_id) {
      const categoryList = await Category.find();
      res.render("admin/categories", { categoryList });
    
    } else {
      res.redirect("/adminLogin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//GETTING ADD CATEGOGORY
const getaddCategory = async (req, res) => {
  try {
    if (req.session.admin_id) {
      res.render("admin/addCategory", { message: req.flash("error") });
    } else {
      res.redirect("/category");
    }
  } catch (error) {
    console.log(error);
  }
};

//ADDING NEW CATEGORY
const addCategory = async (req, res) => {
  try {
    await Category.create({
      category: req.body.category.toLowerCase(),
      description: req.body.description,
    })
    res.redirect("/admin/categories");
  } catch(error) {
    req.flash("error", "This category is already exist");
    res.redirect("/admin/category");
  }
};

//GET EDIT CATEGORY
const getEditCategory = async (req,res) => {
  try {
    const id = req.params.id;

    const categoryData = await Category.findById({_id:id});

    if(categoryData){
      res.render("admin/editCategory",{category:categoryData,message:req.flash("error")});
    }else{
      res.redirect("/admin/categories");
    }
  } catch (error) {
    console.log(error.message);
  }
}

//EDITING CATEGORY
const editCategory = async (req,res) => {
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
      console.log(categoryData);
    }
  } catch (error) {
    req.flash("error", "Category Already exist!");
    res.redirect(`/admin/editcategory/${id}`);
    console.log(error.message);
  }
} 


module.exports = {
  getCategory,
  getaddCategory,
  addCategory,
  getEditCategory,
  editCategory
};

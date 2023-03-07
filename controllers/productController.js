const multer = require("multer");
const Product = require("../models/productModel");
const path = require('path');


//MULTER STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
      const name =Date.now()+'-'+file.originalname;
      cb(null, name);
    }
  })

  const upload = multer({ storage: storage })



//GETTING PRODUCT MANAGMENT
const getProductmanagment = async(req,res) => {
    try {
        if(req.session.admin_id) {
            const productlist = await Product.find();
            res.render("admin/products",{ productlist });
        }else{
            res.redirect("/adminLogin");
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


//GETTING ADD PRODUCTS
const getAddproducts = async (req,res) => {
    try {
        if (req.session.admin_id) {
            res.render("admin/addProduct",{ message: req.flash("error") });
        } else {
            res.redirect("/product")
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


//ADDING NEW PRODUCTS
const addProducts = async(req,res) => {
    try {
        const fieldName = req.file.filename
        const product = new Product({
            product: req.body.product,
            category: req.body.category,
            description: req.body.description,
            image: fieldName,
            stock: req.body.stock,
            status: req.body.status
        })

        const product_data = await product.save();

        res.redirect('/admin/products');
    } catch (error) {
        console.log(error.message);
    }
}


//GET EDIT PRODUCT
const getEditProduct = async (req,res) => {
    try {
        const id = req.params.id;

        const productData = await Product.findById({ _id: id});

        if(productData) {
            res.render("admin/editProduct",{product:productData,message:req.flash("error")});
        }else{
            res.redirect("/admin/products");
        }
    } catch (error) {
        console.log(error.message);
    }
}

//EDITING PRODUCT
const editProduct = async (req,res) => {
    const id = req.params.id;
    try {
        req.body.image = [req.file.filename]
        const productData = await Product.updateOne({_id:id},req.body);

        if(productData){
            req.flash("Success", "Product updated succesfully")
            res.redirect("/admin/products")
        }else{
            res.flash("error", "Product updation failed!!!")
            res.redirect("/admin/editproduct");
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getProductmanagment,
    getAddproducts,
    addProducts,
    getEditProduct,
    editProduct,
    upload,
}
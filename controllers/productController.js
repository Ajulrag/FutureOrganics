const multer = require("multer");
const Product = require("../models/productModel");
const Category = require('../models/categoryModel');
const path = require('path');







//GETTING PRODUCT MANAGMENT
const getProductmanagment = async(req,res,next) => {
    try {
        if(req.session.admin_id) {
            const productlist = await Product.find({isDelete: false}).populate({path:'category', model:'categories'});
            const product = req.session.product;
            delete req.session.product;
            res.render("admin/products",{ productlist, product });
        }else{
            res.redirect("/adminLogin");
        }
    } catch (error) {
        next(error);
    }
}


//GETTING ADD PRODUCTS
const getAddproducts = async (req,res,next) => {
    try {
        if (req.session.admin_id) {
            const categoryList = await Category.find({status:"list"});
            res.render("admin/addProduct",{categoryList, message: req.flash("error") });
        } else {
            res.redirect("/product")
        }
    } catch (error) {
        next(error);
    }
}


//ADDING NEW PRODUCTS
const addProducts = async(req,res,next) => {
    try {
        let productpictures = [];
        if(req.files.length > 0) {
            productpictures = req.files.map((file) => {
                return { img:file.filename}
            });
        }
        const product = new Product({
            product: req.body.product,
            category: req.body.category,
            description: req.body.description,
            image: productpictures,
            price:req.body.price,
            stock: req.body.stock,
            status: req.body.status,
            isFeatured: req.body.isFeatured,
        });
        const product_data = await product.save();
            req.session.product = true;
            res.redirect('/admin/products');
        
    } catch (error) {
        next(error);
    }
}


//GET EDIT PRODUCT
const getEditProduct = async (req,res,next) => {
    try {
        const id = req.params.id;
        const categoryList = await Category.find({status:"list"});
        const productData = await Product.findById(id);
        const editproduct = req.session.product;
        delete req.session.product;
        if(productData) {
            
            res.render("admin/editProduct",{product:productData,editproduct,categoryList,message:req.flash("error")});
        }else{
            res.redirect("/admin/products");
        }
    } catch (error) {
        next(error);
    }
}

//EDITING PRODUCT
const editProduct = async (req,res,next) => {
    const id = req.params.id;
    try {
        console.log(req.files)
        let productpictures = [];
        if(req.files.length > 0) {
            productpictures = req.files.map((file) => {
                return { img:file.filename}
            });
            req.body.image = productpictures;
        }
        const productData = await Product.updateOne({_id:id},req.body);
        
        if(productData){
            req.session.editproduct = true;
            res.redirect("/admin/products")
        }else{
            
            res.redirect("/admin/editproduct");
        }
    } catch (error) {
        next(error);
    }
}





//DELETING PRODUCT
const deleteProduct = async(req,res,next) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndUpdate({_id:id},{$set:{isDelete:true}});
        const product_data = await product.save().then( res.redirect("/admin/products"));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProductmanagment,
    getAddproducts,
    addProducts,
    getEditProduct,
    editProduct,
    deleteProduct,
}
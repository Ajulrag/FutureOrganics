const multer = require("multer");
const Product = require("../models/productModel");
const Category = require('../models/categoryModel');
const path = require('path');
const { log } = require("console");







//GETTING PRODUCT MANAGMENT
const getProductmanagment = async(req,res,next) => {
    try {
        if(req.session.admin_id) {
            const productlist = await Product.find({isDelete: false}).populate({path:'category', model:'categories'}).sort({createdAt: -1});
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
        console.log(req.files)
        const product = new Product({
            product: req.body.product,
            category: req.body.category,
            description: req.body.description,
            image0: req.files[0]?.filename ?? '',
            image1: req.files[1]?.filename ?? '',
            image2: req.files[2]?.filename ?? '',
            image3: req.files[3]?.filename ?? '',
            price:req.body.price,
            offer:req.body.offer,
            stock: req.body.stock,
            status: req.body.status,
            isFeatured: req.body.isFeatured,
        });
        const product_data = await product.save();
            req.session.product = true;
            res.redirect('/admin/products');
        
    } catch (error) {
        console.log(error);
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
        const productData = await Product.updateOne({_id:id},req.body);
        if(productData){
            req.session.editproduct = true;
            res.redirect("/admin/products")
        }else{
            
            res.redirect("/admin/editproduct");
        }
    } catch (error) {
        // console.log(error);
        next(error);
    }
}

//DELETE IMAGES
const deleteImage = async(req,res,next) => {
    try {
        const productId = req.params.productId;
        const imageIndex = req.params.imageIndex;
        // retrieve the product from the database
    const product = await Product.findById(productId);

    // check if the product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // delete the corresponding image from the product
    product.images.splice(imageIndex, 1);

    // save the updated product to the database
    await product.save();

    return res.status(200).json({ message: 'Image deleted successfully' });
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
    deleteImage,
    deleteProduct,
}
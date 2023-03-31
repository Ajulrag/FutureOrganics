const express = require('express');
const productRoute = express();
const productController =require('../controllers/productController');
const adminAuth = require('../middlewares/adminAuth');
const imageUpload = require('../middlewares/imageUpload');
const multer = require('multer');






productRoute.get('/',adminAuth.isLogin,productController.getProductmanagment);
productRoute.get('/addproduct',adminAuth.isLogin,productController.getAddproducts);
productRoute.post('/addproduct',adminAuth.isLogin,imageUpload.upload.array('image',4),imageUpload.resizeImages,productController.addProducts);

productRoute.get('/editproduct/:id',adminAuth.isLogin,productController.getEditProduct);
productRoute.post('/editproduct/:id',adminAuth.isLogin,imageUpload.upload.any(),imageUpload.resizeImages,productController.editProduct);

productRoute.get('/deleteproduct/:id',adminAuth.isLogin,productController.deleteProduct);



module.exports = productRoute;
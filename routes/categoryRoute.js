const express = require('express');
const categoryRoute = express();
const categoryController = require('../controllers/categoryController');
const adminAuth = require('../middlewares/adminAuth');



categoryRoute.get('/',adminAuth.isLogin,categoryController.getCategory);
categoryRoute.get('/addcategory',adminAuth.isLogin,categoryController.getaddCategory);
categoryRoute.post('/addcategory',adminAuth.isLogin,categoryController.addCategory);
categoryRoute.get('/editcategory/:id',adminAuth.isLogin,categoryController.getEditCategory);
categoryRoute.post('/editcategory/:id',adminAuth.isLogin,categoryController.editCategory);





module.exports = categoryRoute;
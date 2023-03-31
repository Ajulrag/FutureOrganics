const express = require('express');
const userManagmentRoute = express();
const userManagmentController = require('../controllers/userManagmentController');
const adminAuth = require('../middlewares/adminAuth');


userManagmentRoute.get('/',adminAuth.isLogin,userManagmentController.getUserManagment);
userManagmentRoute.get('/adduser',adminAuth.isLogin,userManagmentController.getAddUser);
userManagmentRoute.post('/adduser',adminAuth.isLogin,userManagmentController.addUser);
userManagmentRoute.get('/edituser/:id',adminAuth.isLogin,userManagmentController.getEditUSer);
userManagmentRoute.post('/edituser/:id',adminAuth.isLogin,userManagmentController.editUser);


module.exports = userManagmentRoute;
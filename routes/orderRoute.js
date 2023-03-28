const express = require('express');
const orderRoute = express();
const orderController = require('../controllers/orderController');
const adminAuth = require('../middlewares/adminAuth');


orderRoute.get('/',adminAuth.isLogin,orderController.getOrders);


module.exports = orderRoute;
const express = require('express');
const orderRoute = express();
const orderController = require('../controllers/orderController');
const adminAuth = require('../middlewares/adminAuth');


orderRoute.get('/',adminAuth.isLogin,orderController.getOrders);
orderRoute.get('/editorder/:id',adminAuth.isLogin,orderController.getEditOrder);
orderRoute.post('/editorder/:id',adminAuth.isLogin,orderController.doEditorder);


module.exports = orderRoute;
// import express module
const express = require('express');

// import order router module
const orderRouter = express.Router();

// consuming import order controller module
const orderController = require('../controller/order.controller');

// consuming the import user middleware module
const userCheckAuth = require('../middleware/user.middleware');

// consuming the import admin middleware module
const adminCheckAuth = require('../middleware/admin.middleware');


//admin order view with post method 
orderRouter.get('/adminOrderview', adminCheckAuth, orderController.adminView);

// user orderview with get method   
orderRouter.get('/userorderview/:user_id', userCheckAuth, orderController.userView);

// placeorder with post method 
orderRouter.post('/placeorder', userCheckAuth, orderController.orderPlace);


// cancel order with post method 
orderRouter.post('/cancelorder', userCheckAuth, orderController.orderCancel);

// order  delete  with delete method
orderRouter.delete('/clearhistory/:order_id', adminCheckAuth, orderController.orderDelete);


// export order router module
module.exports = orderRouter;
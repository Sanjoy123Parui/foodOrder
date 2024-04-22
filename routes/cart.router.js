// import express module
const express = require('express');

// import cart router module
const cartRouter = express.Router();

//consuming import cart controller
const cartController = require('../controller/cart.controller');

// consuming the import user midleware module
const userCheckAuth = require('../middleware/user.middleware');



// cart view with get method in router
cartRouter.get('/cartview/:user_id', userCheckAuth, cartController.cartView);

// addtocart with post method in router
cartRouter.post('/addtocart/:user_id/:food_id', userCheckAuth, cartController.cartAdd);

// cart delete with put method in router
cartRouter.delete('/cartremove/:user_id/:cart_id/:items_id/:food_id', userCheckAuth, cartController.cartDelete);



// export cart router module
module.exports = cartRouter;

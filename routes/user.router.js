// // import express module
const express = require('express');

// import user controller
const userController = require('../controller/user.controller');

// import user router moedule
const userRouter = express.Router();


// user signup with post method
userRouter.post('/signup', userController.userSignup);

// user login with post method in router
userRouter.post('/signin', userController.userSignin);

// userpassword update with post method 
userRouter.post('/userpasswordchange',  userController.changeuserPassword);


// export admin router module
module.exports = userRouter;
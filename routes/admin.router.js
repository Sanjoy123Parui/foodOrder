// import express module
const express = require('express');

// import admin controller module
const adminController = require('../controller/admin.controller');

// import admin router module
const adminRouter = express.Router();

// user signup with post method
adminRouter.post('/signup', adminController.adminSignup);

// admin login with post method in router
adminRouter.post('/signin', adminController.adminSignin);

// adminpassword update with post method 
adminRouter.post('/adminpasswordchange',  adminController.changeadminPassword);


// export admin router module
module.exports = adminRouter;
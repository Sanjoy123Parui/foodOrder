// import express module
const express = require('express');

// import multer module 
const multer = require('multer');

// define path from upload image
const fileStorage = multer.diskStorage({
    filename:(file,data,cb)=>{
        cb(null, Date.now()+".jpg");
    },
    destination:'public/foodimageuploads/'
});

// object of uploadfiles
const uploadObj = multer({storage:fileStorage});

// import foodRouter module
const foodRouter = express.Router();

// conumin import food controller
const foodController = require('../controller/food.controller');

// consumng the import admin middleware module
const adminCheckAuth = require('../middleware/admin.middleware');

// consumng the import admin middleware module
const userCheckAuth = require('../middleware/user.middleware');



// view the food items with get method
foodRouter.get('/foods', adminCheckAuth, userCheckAuth, foodController.allFoods);

// foodItems view particular id with get method 
foodRouter.get('/foods/:food_id', userCheckAuth, foodController.foodOne);

// foodItems view particular range of the price with get method 
foodRouter.get('/foods/:lim1/:lim2', userCheckAuth, foodController.foodPrice);

// foodItems add with post method 
foodRouter.post('/food', adminCheckAuth, uploadObj.single('avatar'), foodController.foodsAdd);

// delete food item with delete method 
foodRouter.delete('/food/:food_id', adminCheckAuth, foodController.foodDelete);

// food image update wih post method 
foodRouter.post('/food/changePic/:food_id', adminCheckAuth, uploadObj.single('avatar'), foodController.changefoodPic);

// update food items with PUT or PATCH with all method
foodRouter.all('/food/:food_id', adminCheckAuth, foodController.foodUpdate);


// export foodRouter module
module.exports = foodRouter;
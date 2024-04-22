// import mongoose module
const mongoose = require('mongoose');

// import foodSchema module
const foodSchema = mongoose.Schema({
    'food_name':{type:String, require:true},
    'food_desc':{type:String, require:true},
    'food_price':{type:Number, require:true},
    'food_image':{type:String, require:true},
},{versionKey:false});

// export food model module
module.exports = mongoose.model('foodModel',foodSchema,'foods');
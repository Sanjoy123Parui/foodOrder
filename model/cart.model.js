// import mongoose module
const mongoose = require('mongoose');

// import cart schema model module
const cartShema = mongoose.Schema({
    'user_id':{type:mongoose.Schema.Types.ObjectId, ref:'userModel', require:true},
    'items':[{
        'food_id':{type:mongoose.Schema.Types.ObjectId, ref:'foodModel',require:true},
        'orderqty':{type:Number, require:true}
    }],
    'totalprice':{type:Number, require:true}
},{versionKey:false});

// export cart schema model module
module.exports = mongoose.model('cartModel',cartShema,'carts');
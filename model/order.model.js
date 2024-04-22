// import mongoose module
const mongoose = require('mongoose');

// import order model module
const orderSchema = mongoose.Schema({ 
    'cart_id':{type:mongoose.Schema.Types.ObjectId, ref:'cartModel', require:true},
    'user_id':{type:mongoose.Schema.Types.ObjectId, ref:'userModel', require:true},
    'items':[{
        'food_id':{type:mongoose.Schema.Types.ObjectId, ref:'foodModel', require:true},
        'orderqty':{type:Number, require:true},
    }],
    'order_date':{type:String, require:true},
    'order_time':{type:String, require:true},
    'order_status':{type:String, require:true}, 
    'totalprice':{type:Number, require:true}
},{versionKey:false});
  
// export order model module
module.exports = mongoose.model('orderModel',orderSchema,'orders');
// consuming the import oder model module
const orderModel = require('../model/order.model');

// consuming the import cart model module
const cartModel = require('../model/cart.model');



// order date
function getCurrentDate(){
    let orderDate = new Date();
    let customeDate = orderDate.toDateString();
    return customeDate;
}


// order time
function getCurrentTime(){
    let orderTime = new Date();
    let hr = orderTime.getHours();
    let min = orderTime.getMinutes();
    let sec = orderTime.getSeconds();

    let fmt = '';
    if(hr>12){
        hr = hr-12;
        fmt = 'PM';
    }
    else{
        fmt = 'AM';
    }
    
    let customeTime = hr+":"+min+":"+sec+" "+fmt;

    return customeTime;
}



// admin view order function
const adminView = async(req,res)=>{
    try {
        let orderData = await orderModel.find({}).populate({'path':'user_id'})
                        .populate({'path':'items',populate:[{'path':'food_id'}]}).exec();

        res.status(200).json({'data':orderData});
        
    } 
    catch (error) {
        res.status(500).json({'message':`Internal server error:${error}`});    
    }
} 



// user order view functionality
const userView = async(req,res)=>{
    try {
        
        let orderData = await orderModel.find({'user_id':req.params.user_id})
                .populate({'path':'items',populate:[{'path':'food_id'}]}).exec();

            if(!orderData){
                res.status(404).json({'message':'your order was empty'});
            }
            else{
                res.status(200).json({'data':orderData});
            }
        
    } 
    catch (error) {
        res.status(500).json({'message':`Internal server error:${error}`});
    }
}



// user add order function
const orderPlace = async(req,res)=>{
    try {

        let userId = req.body.user_id;
        let cartId = req.body.cart_id
        let orderStatus = "Buy";
          
        let cartData = await cartModel.findOne({'_id':cartId}).exec();

        let orderInfo = new orderModel({
            'cart_id':cartId,
            'user_id':userId,
            'items':cartData.items,
            'order_status':orderStatus,
            'order_date':getCurrentDate(),
            'order_time':getCurrentTime(),
            'totalprice':cartData.totalprice
        });

        let orderData = await orderInfo.save();

        if(!orderData){
            res.status(404).json({'message':'no have items are order'});
        }
        else{
            await cartModel.deleteMany({});
            res.status(201).send({'message':'order placed successfully'});
        }   
        
    }
    catch (error) {
        res.status(500).json({'message':`Internal server error:${error}`});
    }
}



// order cancel functionality
const orderCancel = async(req,res)=>{
    try {
        let orderId = req.body.order_id;
        let userId = req.body.user_id;
        let orderStatus = "Cancel";

        let orderData = await orderModel.updateOne({'_id':orderId,'user_id':userId},{$set:{
            'order_status':orderStatus,
            'order_date':getCurrentDate(),
            'order_time':getCurrentTime()
        }});

        if(!orderData){
            res.status(404).json({'message':'order does not exist'});
        }
        else{
            res.status(200).json({'message':'your order cancel successfully'});
        }

    } 
    catch (error) {
        res.status(500).json({'message':`Internal server error:${error}`});
    }
}



// order delete functionality
const orderDelete = async(req,res)=>{
    try {
        let orderData = await orderModel.deleteOne({'_id':req.params.order_id});
        
        if(orderData.deletedCount){
            res.status(200).json({'message':'one order history data clear successfully'});
        }
        else{
            res.status(404).json({'message':'no has been order data found'});
        }     
    } 
    catch (error) {
        res.status(500).json({'message':`Inernal server error:${error}`});
    }
}


// export order controller
module.exports = {
    adminView,
    userView,
    orderPlace,
    orderCancel,
    orderDelete
};
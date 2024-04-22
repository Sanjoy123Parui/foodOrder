// consuming the import cart model module
const cartModel = require('../model/cart.model');

// consuming the import food model module
const foodModel = require('../model/food.model');



// cart view function
const cartView  = async(req,res)=>{
    try {

        let userId = req.params.user_id;

        let cartData = await cartModel.findOne({'user_id':userId})
                        .populate({'path':'items',populate:{'path':'food_id'}}).exec();

        if(!cartData){
            res.status(404).json({'message':'no such items are added'});
        }
        else{
            res.status(200).json({'data':cartData});
        }
        
    } 
    catch (error) {
        res.status(500).json({'message':`Internal server error`});
    }
}



// cart add function
const cartAdd = async(req,res)=>{

    try {

        let userId = req.params.user_id;
        let foodId = req.params.food_id;

        let foodData = await foodModel.findOne({'_id':foodId}).exec();

        let total = 0;

        let orderQty = req.body.orderqty;

        if(!orderQty){
            orderQty = 1;
            total+=Number(orderQty*foodData.food_price);
        }
        else{
            total+=Number(orderQty*foodData.food_price);
        }
        
        let userCart = await cartModel.findOne({'user_id':userId}).exec();

        if(userCart){
            let cartItems = await cartModel.updateOne({'user_id':userCart.user_id},{$push:{
                'items':[{
                    'food_id':foodId,
                    'orderqty':orderQty
                }]
            },$inc:{
                'totalprice':total
            }});

            // await userCart.save();

            if(cartItems.matchedCount && cartItems.modifiedCount){
                res.status(201).send({'message':'Foods item are addtocart successfully'});
            }
            else{
                res.status(404).json({'message':'food items are not inserted'});
            }

            
        }
        else{
            let cartInfo = new cartModel({
                'user_id':userId,
                'items':[{
                    'food_id':foodId,
                    'orderqty':orderQty
                }],
                'totalprice':total
            });

            let cartData = await cartInfo.save();

            if(!cartData){
                res.status(404).json({'message':'your cart no have found'});
            }
            else{
                res.status(201).send({'message':'Foods item are addtocart successfully'});
            }

           
        }
    }

    catch (error) {
        res.status(500).json({'message':`Internal server error:${error}`});
    }
    
}



// cart remove function
const cartDelete = async(req,res)=>{

    try {
        
        let cartId = req.params.cart_id;
        let userId = req.params.user_id;
        let itemsId = req.params.items_id;
        let foodId = req.params.food_id;

        let foodData = await foodModel.findOne({'_id':foodId}).exec();

        var cartItems = await cartModel.findOne({'_id':cartId}).exec();

        // retrive orderqty
        var cartInfo = cartItems.items.find((item)=>{
            return item._id.toString() === itemsId;
        });


        let total = Number(foodData.food_price*cartInfo.orderqty);
                    cartItems.totalprice-=total;
        let totalAmount = cartItems.totalprice;

        let cartData = await cartModel.updateOne({'_id':cartId,'user_id':userId},{$pull:{
            'items':{
                '_id':itemsId,
                'food_id':foodId   
            }
        },$set:{
            'totalprice':totalAmount
        }});

        if(cartData.matchedCount && cartData.modifiedCount){

            res.status(200).json({'message':'One cart items are removed successfully'});
        }
        else{
            res.status(404).json({'message':'No such have carts'});
        }
        
    } 
    catch (error) {
        res.status(500).json({'message':`Internal server error: ${error}`});
    }
}



// export cart controller
module.exports = {
    cartView,
    cartAdd,
    cartDelete
};
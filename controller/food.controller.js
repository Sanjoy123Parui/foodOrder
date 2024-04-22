// consuming the food model module
const foodModel = require('../model/food.model');

// consuming the import base_url module
const base_url = require('../base_url');


// foods all data fetch function
const allFoods = async(req,res)=>{

    try {

        let foodData = await foodModel.find({}).exec();

        res.status(200).json(foodData);
        
    }

    catch (error) {

        res.status(500).json({'message':`Internal server error:${error}`});

    }

}


//single food data fetch function
const foodOne =  async(req,res)=>{

    try {

        let foodData = await foodModel.findOne({'_id':req.params.food_id}).exec();
        
        if(!foodData){
            res.status(404).json({'message':'No such food items exist !'});
        }

        else{
            res.status(200).json({'data':foodData});
        }

    } 

    catch (error) {

        res.status(500).json({'message':`Internal server error:${error}`});

    }

}


// food price fetch function
const foodPrice = async(req,res)=>{
    
    try {

        let foodData = await foodModel.find({
            $and:[{'food_price':{$gte:req.params.lim1}},{'food_price':{$lte:req.params.lim2}}]
        }).exec();
        
        res.status(200).json(foodData);

    }

    catch (error) {

        res.status(500).json({'message':`Internal server error:${error}`});

    }

}


// foods data add function
const foodsAdd = async(req,res)=>{
    
    try {

        let foodInfo = new foodModel({
            'food_name':req.body.food_name,
            'food_desc':req.body.food_desc,
            'food_price':req.body.food_price,
            'food_image':base_url+'foodimageuploads/'+req.file.filename
        });

        let foodData = await foodInfo.save();

        if(!foodData){
            res.status(404).json({'message':'No more added any food items'});
        }
        else{
            res.status(201).send({'message':'one food added successfully'});
        }

    } 

    catch (error) {

        res.status(500).json({'message':`Internal server error:${error}`});

    }

}



// foods delete function
const foodDelete = async(req,res)=>{

    try {

        let foodData = await foodModel.deleteOne({'_id':req.params.food_id});

        // res.status(200).json(foodData);
        if(foodData.deletedCount){
            res.status(200).json({'message':'One food items deleted'});
        }
        else{
            res.status(404).json({'message':'unable to delete'});
        }

    } 

    catch (error) {

        res.status(500).json({'message':`Internal server error:${error}`});

    }
}



// foods picture update function
const changefoodPic = async(req,res)=>{

    try {

        let foodData = await foodModel.updateOne({'_id':req.params.food_id},{$set:{
            'food_image':base_url+'foodimageuploads/'+req.file.filename
        }});
        
        if(foodData.acknowledged){
            res.status(201).send({'message':'food images is changed successfully'});
        }
        else{
            res.status(404).json({'message':'food images are not changed '});
        }

    } 

    catch (error) {
        res.status(500).json({'message':`Internal server error:${error}`});
    }
}



// update foods function
const foodUpdate = async(req,res)=>{

    if(req.method == 'PUT' || req.method == 'PATCH'){

        try {

            
            let foodData = await foodModel.updateOne({'_id':req.params.food_id},{$set:{
                'food_name':req.body.food_name,
                'food_desc':req.body.food_desc,
                'food_price':req.body.food_price,
            }});

            if(foodData.matchedCount && foodData.modifiedCount){
                res.status(201).send({'message':'Food Record Updated'});
            }
            else{
                res.status(404).json({'message':'Error while Updating Info'});
            }

        } 

        catch (error) {

                res.status(500).json({'message':`Internal server error: ${error}`});

        }
    }

    else{

        res.status(404).json({'message':'wrong cridential'});

    }

}

// export food controller
module.exports = {
    allFoods,
    foodOne,
    foodPrice,
    foodsAdd,
    foodDelete,
    changefoodPic,
    foodUpdate
};
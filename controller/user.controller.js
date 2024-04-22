// import jwt module
const jwt = require('jsonwebtoken');

// import bcryptjs module
const bcryptjs = require('bcryptjs');

// consuming the import user module
const userModel = require('../model/user.model');


// user signup function
const userSignup = async(req,res)=>{

    try {

        let userName = req.body.user_name;
        let userEmail = req.body.user_email;
        let userPhone = req.body.user_phone;
        let userPass = req.body.user_pass;
        let userConfirmPass = req.body.user_confirmpass;

        let salt = bcryptjs.genSaltSync(10);
        let hashPass = bcryptjs.hashSync(userPass, salt);

        if(userPass !== userConfirmPass){
            res.status(404).json({'message':'This user password are not matched please enter the correct password !'});
        }

        else{


            let existUser = await userModel.findOne({$or:[{'user_email':userEmail},{'user_phone':userPhone}]});

            if(existUser){

                res.status(200).json({'message':'This user email and phone is already registerd please try again another once !'});

            }

            else{

                let userInfo = new userModel({
                    'user_name' : userName,
                    'user_email' : userEmail,
                    'user_phone' : userPhone,
                    'user_pass' : hashPass
                });
        
               let userData = await userInfo.save();
            
               if(userData){
                    res.status(201).send({'message':'user signup successfully'});
               }
               else{
                    res.status(404).json({'message':'please signup once again'});
               }   

            }
            
        }

    } 
    
    catch (error) {
        res.status(500).json({'message':`Internal server error:${error}`});
    }

}


// user signin functionality
const userSignin = async(req,res)=>{

    try {
        let userData = await userModel.findOne({'user_email':req.body.user_email}).exec();
        
        if(!userData){
            res.status(404).json({'message':'user does not exist'});
        }
        else{
            let dbPass = userData.user_pass;
            var result = bcryptjs.compareSync(req.body.user_pass,dbPass);

            if(result){
                var userLoginToken = jwt.sign({'_id':userData._id}, process.env.SKEY, {expiresIn:'12h'});
                res.status(201).send({'message':'user login successfully', 'user_id':userData._id,
                 'userActive':userData.user_name, 'token':userLoginToken});
            }
            else{
                res.status(404).json({'message':'Wrong Cridentials !'});
            }
        }
    } 
    
    catch (error) {

        res.status(500).json({'message':error});
    }

}


// user password change function
const changeuserPassword = async(req,res)=>{

    try {

        let userEmail = req.body.user_email;
        let userPass = req.body.user_pass;
        let userConfirmPass = req.body.user_confirmpass;

        let userInfo = await userModel.findOne({'user_email':userEmail});

        let salt = bcryptjs.genSaltSync(10);
        let hashPass = bcryptjs.hashSync(userPass,salt);

        if(userInfo){
            
            if(userPass!==userConfirmPass){
                res.status(404).json({'message':'user Password are not matched please insert the valid password'});
            }

            else{
 

                let userData = await userModel.updateOne({'user_email':userEmail},{$set:{
                    'user_pass': hashPass
                }});

                if(userData.matchedCount && userData.modifiedCount){
                    res.status(201).send({'message':'User password has been changed successfully'});
                }
                else{
                    res.status(404).json({'message':'wrong cridential'});
                }


            }
        }

        else{
            res.status(404).json({'message':'This user does not exist'});
        }
        
    }
    
    catch (error) {
        res.status(500).json({'message':error});
    }

}


// export user module
module.exports = {
    userSignup,
    userSignin,
    changeuserPassword
};
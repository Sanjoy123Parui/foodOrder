// consuming the import admin  module
const adminModel = require('../model/admin.model');

// consuming the import bcryptjs module
const bcryptjs = require('bcryptjs');

// consuming the import jwt module
const jwt = require('jsonwebtoken');


// admin signup function
const adminSignup = async(req,res)=>{

    try {

        let adminName = req.body.admin_name;
        let adminEmail = req.body.admin_email;
        let adminPhone = req.body.admin_phone;
        let adminPass = req.body.admin_pass;
        let adminConfirmPass = req.body.admin_confirmpass;

        let salt = bcryptjs.genSaltSync(10);
        let hashPass = bcryptjs.hashSync(adminPass, salt);

        if(adminPass !== adminConfirmPass){
            res.status(404).json({'message':'This admin password are not matched please enter the correct password !'});
        }

        else{


            let existAdmin = await adminModel.findOne({$or:[{'admin_email':adminEmail},{'admin_phone':adminPhone}]});

            if(existAdmin){

                res.status(200).json({'message':'This admin email and phone is already registerd please try again another once !'});

            }

            else{

                let adminInfo = new adminModel({
                    'admin_name' : adminName,
                    'admin_email' : adminEmail,
                    'admin_phone' : adminPhone,
                    'admin_pass' : hashPass
                });
        
               let adminData = await adminInfo.save();
            
               if(adminData){
                    
                    res.status(201).send({'message':'admin signup successfully'});
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



// admin signin function
const adminSignin = async(req,res)=>{

    try {
        let adminData = await adminModel.findOne({'admin_email':req.body.admin_email}).exec();
        
        if(!adminData){
            res.status(404).json({'message':'admin does not exist'});
        }
        else{
            let dbPass = adminData.admin_pass;
            var result = bcryptjs.compareSync(req.body.admin_pass,dbPass);

            if(result){
                var adminLoginToken = jwt.sign({'_id':adminData._id}, process.env.SKEY, {expiresIn:'12h'});
                res.status(201).send({'message':'admin login successfully', '_id':adminData._id,
                'adminActive':adminData.admin_name, 'token':adminLoginToken});
            }
            else{
                res.status(404).json({'message':'Wrong Cridentials !'});
            }
        }
    } 
    
    catch (error) {

        res.status(500).json({'message':`Internal server error:${error}`});
    }

}


// admin password change function
const changeadminPassword = async(req,res)=>{

    try {

        let adminEmail = req.body.admin_email;
        let adminPass = req.body.admin_pass;
        let adminConfirmPass = req.body.admin_confirmpass;

        let adminInfo = await adminModel.findOne({'admin_email':adminEmail});

        let salt = bcryptjs.genSaltSync(10);
        let hashPass = bcryptjs.hashSync(adminPass,salt);

        if(adminInfo){
            
            if(adminPass!==adminConfirmPass){
                res.status(404).json({'message':'admin Password are not matched please insert the valid password'});
            }

            else{
 

                let adminData = await adminModel.updateOne({'admin_email':adminEmail},{$set:{
                    'admin_pass': hashPass
                }});

                if(adminData.matchedCount && adminData.modifiedCount){
                    res.status(201).send({'message':'Admin password has been changed successfully'});
                }
                else{
                    res.status(404).json({'message':'wrong cridential'});
                }


            }
        }

        else{
            res.status(404).json({'message':'This admin does not exist'});
        }
        
    }
    
    catch (error) {
        res.status(500).json({'message':`Internal server error:${error}`});
    }

}



// export admin controller
module.exports = {
    adminSignup,
    adminSignin,
    changeadminPassword
};
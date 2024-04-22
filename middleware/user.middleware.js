// import jwt module
const jwt = require('jsonwebtoken');

const userCheckAuth = async(req,res,next)=>{

    try {
        
        await jwt.verify(req.headers.token, process.env.SKEY);
        next();
    } 
    catch (error) {

        return res.status(404).json({'message':'Token expired or not created'});
        
    }
    
}

// export admin middlware module
module.exports = userCheckAuth;
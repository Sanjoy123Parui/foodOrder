// import mongoose module
const mongoose = require('mongoose');

// import user model schema
const userSchema = mongoose.Schema({
    'user_name' : { type:String, require:true },
    'user_email' : { type:String, require:true, unique:true },
    'user_phone' : { type:String, require:true, unique:true },
    'user_pass' : { type:String, require:true }
},{versionKey:false});

// export user model
module.exports = mongoose.model( 'userModel', userSchema, 'users' );
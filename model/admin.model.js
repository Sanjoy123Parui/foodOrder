// import mongoose module
const mongoose = require('mongoose');

// import admin model module
const adminSchema = mongoose.Schema({
    'admin_name':{type:String, require:true},
    'admin_email':{type:String, require:true, unique:true},
    'admin_phone':{type:String, require:true, unique:true},
    'admin_pass':{type:String, require:true},
},{versionKey:false});

// export admin model module
module.exports = mongoose.model('adminModel',adminSchema,'admin');
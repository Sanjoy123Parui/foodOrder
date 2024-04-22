// import dotenv
const dotenv = require('dotenv');
dotenv.config();

// import express module
const express = require('express');

// import cors module
const cors = require('cors');

// consuming the import admin router module
const adminRouter = require('./routes/admin.router');

// consuming the import user router module
const userRouter = require('./routes/user.router');

// consuming the import admin router module
const foodRouter = require('./routes/food.router');

// consuming the import admin router module
const cartRouter = require('./routes/cart.router');

// consuming the import admin router module
const orderRouter = require('./routes/order.router');

// import mongoose module
const mongoose = require('mongoose');

// connect to the database with mongodb
const db = process.env.DB;

mongoose.connect(db)
.then((result)=>{
    console.log(result);
})
.catch((error)=>{
    console.log(error);
});


// define port number
const port = process.env.PORT;

// use object of middleware
const app = express();

// use body parser
app.use(cors());

app.use(express.static('public'));

app.use(express.urlencoded({extended:true}))

app.use(express.json());

app.use('/adminapi', adminRouter);

app.use('/userapi', userRouter);

app.use('/foodapi', foodRouter);

app.use('/cartapi', cartRouter);

app.use('/orderapi', orderRouter);


// test the api with get
app.get('/',(req,res)=>{
    res.send("<h1>Welcome to online food order system Rest API</h1>");
});


// check the port 
app.listen(port,()=>{
    console.log(`Server has been started at port:${port}`);
});
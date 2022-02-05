//import mongoose
const mongoose=require('mongoose')    //sep 28 14:14

//connect server to db
mongoose.connect('mongodb://localhost:27017/BankApp',{
    useNewUrlParser:true
})

//Model Creation
const User=mongoose.model('User',
{
    uname:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})



//Exports
module.exports={
    User
}
const mongoose = require('mongoose');
module.exports.connect = () => {
    try{
        mongoose.connect(process.env.DATABASE);
        console.log("Connect to Database successfuly!");
    }
    catch(error){
        console.log("Connect to Database unsuccessfuly!");
        console.log(error);
    }
}
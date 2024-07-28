const mongoose = require('mongoose');

const connectDB = async() => {
    try{
           const conn = await mongoose.connect(process.env.MONO_URI || "mongodb+srv://harshavardhana15015:harshavardhana15015@cluster0.g9vubd4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
           console.log("db connected");
    }catch (error){
         console.log(`error: ${error.message}`);
         process.exit();
    }
};

module.exports = connectDB;
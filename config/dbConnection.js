const mongoose = require('mongoose');

const dbConnect = () => {
    try{
        const conn = mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected succesfully");
    }
    catch(error){
        console.log("Connection failed");
    }
};

mongoose.set("strictQuery",true);

module.exports = dbConnect;

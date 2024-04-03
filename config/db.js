const mongoose = require('mongoose');
const mongoUrl = process.env.MONGO_URI||"mongodb://localhost:27017/my_database";

const dataBaseConnection=()=>{
    mongoose
        .connect(mongoUrl)
        .then((conn)=>console.log(`connection to Db: ${conn.connection.host}`))
        .catch((err)=>console.log(err.message));
}

module.exports = dataBaseConnection;
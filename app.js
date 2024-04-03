const express = require("express");
const app = express();
const authRouter = require('./routert/authRouter.js')
const cookieParser = require('cookie-parser');
const dataBaseConnection = require('./config/db.js');
dataBaseConnection();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter)
app.use('/',(req,res)=>{
    res.status(200).json({
        data:"Jwt server"
    })
});
module.exports = app

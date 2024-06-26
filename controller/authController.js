const userModel = require("../model/userSchema.js");
const bcrypt = require('bcrypt');
const emailValidator = require("email-validator");
const signup = async(req,res,next)=>{
    const {name,email,password,confirmpassword} = req.body;
    if(!name||!email||!password||!confirmpassword){
        return res.status(400).json({
            success:false,
            message:'Every field is required'
        })
    }
    const validEmail = emailValidator.validate(email);
    if(!validEmail){
        return res.status(400).json({
            success:false,
            message:'Please Enter a valid email'
        })
    }
    if(password!==confirmpassword){
        return res.status(400).json({
            success:false,
            message:"password doesn't match"
        })
    }
    try {
        const userInfo = userModel(req.body);
        const result = await userInfo.save();
        return res.status(200).json({
            success:true,
            data:result
        })
    } catch (error) {
        if(res.status===11000){
            return res.status(400).json({
                success:false,
                data:"Account already exists with the given email"
            })
        }
        return res.status(400).json({
            success:false,
            data:err.message
        })
    }
}

const signin=async(req,res,next)=>{
    const {email,password} =req.body;
    if(!email||!password){
        return res.status(400).json({
            success:false,
            message:"all fields are required",
        })
    }
    try {
        const user = await userModel.findOne({email}).select('+password');
        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(400).json({
                success:false,
                message:"wrong credentials",
    
            })
        }     
        const token = user.jwtToken();
        user.password= undefined;
        const cookieOption = {
            maxAge:24*60*60*1000,
            httpOnly:true
        }
        res.cookie("token",token,cookieOption);
        res.status(200).json({
            success:true,
            data:user
        })
    
    } catch (error) {
        return res.status(400).json({
            success:false,
            field:"signin",
            message:error.message
        })
    }

}

const logout = (req,res,next)=>{
    try {
        const cookieOption = {
            expires:new Date(),
            httpOnly:true
        }
        res.cookie("token",null,cookieOption)
        res.status(200).json({
            success:true,
            message:"Logout Successfully"
        })
    } catch (error) {
        res.status(200).json({
            success:true,
            message:error.message
        })
    }
}

const getUser=async(req,res,next)=>{
    const userId = req.user.id;
    try {
        const user = await userModel.findById(userId);
        return res.status(200).json({
            success:true,
            data:user
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {
    signup,
    signin,
    getUser,
    logout
}
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema} = mongoose;
const JWT = require('jsonwebtoken');
const userSchema = new Schema({
    name:{
        type:String,
        require:[true,"name is required"],
        minLength:[5,"Name must have more than 5 char"],
        maxLength:[50,"Name must have less than 50 char"],
        trim:true
    },
    email:{
        type:String,
        require:[true,"email is required"],
        unique:[true,"alredy registered"],
        lowercase:true
    },
    password:{
        type:String,
        select:false
    },
    confirmpassword:{
        type:String,
        select:false
    },
    forgotPasswordToken:{
        type:String
    },
    forgotPasswordExpiryData:{
        type:Date
    }
},{
    timestamps:true
});

userSchema.methods = {
    jwtToken(){
        return JWT.sign( 
            {
                id:this._id,
                email:this.email,
            },
            process.env.SECRET,
            {expiresIn:'24h'}  
        )
    }
}

userSchema.pre("save",
async function(next){
    if(!this.isModified('password')){
        return next();
    }
   this.password = await bcrypt.hash(this.password,10)
   return next();   
})
const userModel = mongoose.model("User",userSchema);
module.exports = userModel;
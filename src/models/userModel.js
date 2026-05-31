import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select : false
    },
    profileImg:{
        type:String,
        required:false
    },
    balance:{
        type:Number,
        default:1000,
        min:0
    },
    resetPasswordOtp:{
        type:Number,
        required:false
    },
    resetPasswordOtpExpiry:{
        type:Date,
        required:false
    }
},{timestamps:true})

const userModel = new mongoose.model("User",userSchema);

export default userModel;
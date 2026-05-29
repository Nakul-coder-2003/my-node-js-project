import uploadOnCloudinary from "../config/cloudinary.js";
import generateToken from "../config/token.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt"
import { sendLoginEmail, sendRegistrationEmail } from "../services/email.js";

export const signup = async(req,res)=>{
  try {
    const {firstName,lastName,userName,email,password} = req.body;

    if(!firstName || !lastName || !userName || !email || !password){
        return res.status(400).json({message:"Please fill all details!"})
    }

    let profileImg
    if(req.file){
        profileImg = await uploadOnCloudinary(req.file.path)
    }

    const existUser = await userModel.findOne({email});
    if(existUser){
        return res.status(400).json({message:"user already exist!"})
    }

    const hashPassword = await bcrypt.hash(password,10);

    const newUser = await userModel.create({
        firstName,
        lastName,
        userName,
        email,
        password:hashPassword,
        profileImg
    })

    let token;
    try{
       token = generateToken(newUser._id)
    }catch(error){
        console.log(error)
    }

    res.cookie("token",token).status(200).json({message:"user create successfully!"})
    
    await sendRegistrationEmail(newUser.email,newUser.firstName)

  } catch (error) {
    console.log(error)
     return res.status(500).json({message:"internal server error, error:error"})
  }
}

export const login = async(req,res)=>{
   try {
    const {email,password} = req.body;
    // console.log(email);
    if(!email || !password){
        return res.status(400).json({message:"please send email or password!"})
    }

    const existUser = await userModel.findOne({email}).select("+password");
    if(!existUser){
        return res.status(400).json({message:"user does not exist! please create account first!"})
    }

    const matchPass = await bcrypt.compare(password,existUser.password)
    if(!matchPass){
        return res.status(400).json({message:"invalid credentail!"})
    }

    let token;
    try {
        token = generateToken(existUser._id)
    } catch (error) {
        console.log(error)
    }

    res.cookie("token",token).status(200).json({message:'user login successfully!'})

    // await sendLoginEmail(existUser.email,existUser.firstName)

   } catch (error) {
    console.log(error)
    return res.status(500).json({message:"internal server error, error:error"})
   }
}

export const logout = async(req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({message:"user logout successfully!"})
    } catch (error) {
        return res.status(500).json({ message: "internal serval error",error:error });
    }
}

export const getAlluser = async(req,res)=>{
    try {
        const users = await userModel.find();

        res.status(200).json({
            message: "fatch all user1",
            users: users
        })
    } catch (error) {
        console.log(error)
    }
}

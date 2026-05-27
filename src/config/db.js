import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_UPL);
        console.log("database connected!")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;
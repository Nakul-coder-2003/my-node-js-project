import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema({
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:1
    },
    status:{
        type:String,
        enum:["pending","success","failed"],
        default:"pending"
    }
},{timestamps:true})

const transactionModel = mongoose.model("Transaction",transactionSchema);

export default transactionModel;
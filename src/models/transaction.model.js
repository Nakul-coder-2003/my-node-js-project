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
    type:{
        type:String,
        enum: ["transfer","request"],
        default:"transfer"
    },
    status:{
        type:String,
        enum:["pending","success","failed","Approved","Rejected"],
        default:"pending"
    }
},{timestamps:true})

const transactionModel = mongoose.model("Transaction",transactionSchema);

export default transactionModel;
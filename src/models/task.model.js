import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","in-process","completed"],
        default:"pending"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})


const taskModel = mongoose.model("Task",taskSchema)

export default taskModel;
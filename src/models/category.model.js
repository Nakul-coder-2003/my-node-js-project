import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"category name is required"],
        unique:true,
        trim:true
    },
    description:{
        type:String
    },
    parentCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default:null
    }
},{timestamps:true});

export const categoryModel = mongoose.model("Category",categorySchema);

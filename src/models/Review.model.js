import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    ratting:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true
    }
},{timestamps:true});

// Ek user ek product par sirf 1 hi review de sakta hai.
reviewSchema.index({product:1,user:1},{unique:true});

export const reviewModel = mongoose.model("Review",reviewSchema);
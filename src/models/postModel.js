import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type:"String"
    },
    description:{
        type: "String"
    }
})

const postModel = new mongoose.model("Post",postSchema);

export default postModel;
import postModel from "../models/postModel.js";

export const createPost = async(req,res)=>{
  try {
    const {title,description} = req.body;
    await postModel.create({
        title:title,
        description:description
    })

    res.status(201).json({
        message:"create post successfully!"
    })
  } catch (error) {
    console.log(error)
  }
}

export const getAll = async(req,res)=>{
    try {
        const posts = await postModel.find();

        res.status(200).json({
            message:"fatch all posts!",
            posts:posts
        })
    } catch (error) {
        console.log(error)
    }
}
//package import
import express from "express"
import connectDB from "./src/config/db.js";
import dotenv from "dotenv"
import postRouter from "./src/routes/postRoutes.js";
import userRouter from "./src/routes/userRoutes.js";
import cookieParser from "cookie-parser";

//configration
dotenv.config();
const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cookieParser());

//api
app.use("/api/instaPost/",postRouter);
app.use("/api/user/",userRouter)

// server running
app.listen(port,()=>{
    connectDB()
    console.log(`server is running on ${port}`)
})
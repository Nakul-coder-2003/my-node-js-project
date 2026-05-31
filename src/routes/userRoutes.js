import { forgetPassword, getAlluser, login, logout, resetPassword, signup } from "../controllers/userControllers.js";
import express,{Router} from "express";
import { uploadFile } from "../middleware/multer.js";
import {isAuthenticated} from "../middleware/auth.middleware.js"

const userRouter = express(Router());

userRouter.post("/signup",uploadFile.single("profileImg"),signup)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.get("/allusers",isAuthenticated,getAlluser)
userRouter.post("/forget-password",isAuthenticated,forgetPassword);
userRouter.post("/reset-password",isAuthenticated,resetPassword)

export default userRouter;
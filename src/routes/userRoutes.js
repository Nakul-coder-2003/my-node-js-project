import { getAlluser, login, logout, signup } from "../controllers/userControllers.js";
import express,{Router} from "express";
import { uploadFile } from "../middleware/multer.js";

const userRouter = express(Router());

userRouter.post("/signup",uploadFile.single("profileImg"),signup)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.get("/allusers",getAlluser)

export default userRouter;
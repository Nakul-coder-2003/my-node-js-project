import express,{Router} from "express"
import { createPost,getAll } from "../controllers/postControllers.js";

const postRouter = express(Router());

postRouter.post("/create", createPost);
postRouter.get("/all", getAll);


export default postRouter;
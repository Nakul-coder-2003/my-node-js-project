import express from "express"
import { createTask, deleteTask, getMyTasks, updateTask } from "../controllers/task.controller.js";
import {isAuthenticated} from "../middleware/auth.middleware.js"

const taskRouter = express.Router();

taskRouter.post("/create",isAuthenticated,createTask)
taskRouter.get("/my-task", isAuthenticated, getMyTasks)
taskRouter.patch("/update/:id", isAuthenticated, updateTask)
taskRouter.delete("/delete/:id", isAuthenticated, deleteTask)

export default taskRouter;
import taskModel from "../models/task.model.js";

export const createTask = async(req,res) => {
   try {
    console.log(req.body)
    const {title,description} = req.body;
    const userId = req.user.id;

    if(!title || !description){
        return res.status(400).json({message:"Please fill information"})
    }

    const newTask = await taskModel.create({
        title,
        description,
        user:userId
    })

    res.status(200).json({
        message:"task create successfully!",
        task:newTask
    })
   } catch (error) {
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
   }
}

export const getMyTasks = async(req,res) => {
    try {
        const userId = req.user.id;

        const tasks = await taskModel.find({user:userId});

        res.status(200).json({
            message:"task fatch successfully!",
            totalTask:tasks.length,
            tasks: tasks
        })
    } catch (error) {
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

export const updateTask = async(req,res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const { title, description, status } = req.body;

        const updatedTask = await taskModel.findOneAndUpdate(
            {_id:taskId,user:userId},
            {title, description, status},
            {new:true,runValidators:true}
        )

        if (!updatedTask) {
            return res.status(404).json({ 
                message: "Task not found or you are not authorized to update this task!" 
            });
        }

        res.status(200).json({ 
            message: "Task updated successfully", 
            task: updatedTask 
        })

    } catch (error) {
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

export const deleteTask = async(req,res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;

        const deletedTask = await taskModel.findOneAndDelete(
            {_id:taskId, user:userId}
        )

        if (!deletedTask) {
            return res.status(404).json({ 
                message: "Task not found or you are not authorized to update this task!" 
            });
        }

        res.status(200).json({ 
            message: "Task deleted successfully", 
            task: deletedTask 
        });
    } catch (error) {
         return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}
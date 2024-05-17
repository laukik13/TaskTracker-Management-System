import { Task } from "../Models/task.model.js";
import { User } from "../Models/user.model.js";
import { Project } from "../Models/project.model.js";
import { PendingTask } from "../Models/pendingTask.model.js";
import { AsyncHandler } from "../Utils/asyncHandler.js";
import { CompletedTask } from "../Models/completedTask.model.js";

//Admin & Project Manger
const createTask = async (req, res) => {
  const {
    title,
    description,
    status,
    assignedTo,
    assignedDate,
    project,
    dueTime,
  } = req.body;

  if (req.user.role !== "Admin" && "Project Manager") {
    return res.status(400).json({ message: "Sorry!!! You cannot Create Task" });
  }

  if (
    [
      title,
      description,
      status,
      assignedTo,
      assignedDate,
      project,
      dueTime,
    ].some((field) => field?.trim() === "")
  ) {
    return res.status(400).json({ message: "All fields are Empty" });
  }

  const taskExists = await Task.findOne({ title });

  if (taskExists) {
    return res.status(400).json({ message: "Task Already Exists" });
  }

  // const assignedToExists = await User.findById(assignedTo);

  // if(!assignedToExists){
  //     res.status(400).json({message:"Assigned Member is Invalid"});
  // }

  const assignedToExists = await User.findOne({ _id: assignedTo });

  if (!assignedToExists) {
    return res.status(400).json({ message: "Assigned Member is Invalid" });
  }

  // const projectIdExists = await Project.findById(projectId);

  // if(!projectIdExists){
  //     res.status(400).json({message:"Project Id is Invalid"});
  // }

  const projectIdExists = await Project.findOne({ _id: project });

  if (!projectIdExists) {
    return res.status(400).json({ message: "Project Id is Invalid" });
  }

  const date = new Date(assignedDate).toLocaleDateString();

  const task = await Task.create({
    title,
    description,
    status,
    assignedTo: assignedToExists._id,
    assignedDate: date,
    project: projectIdExists._id,
    createdBy: req.user._id,
    dueTime,
  });

  if (!task) {
    return res
      .status(400)
      .json({ message: "Somthing Went Wrong While creating Task" });
  }

  res.status(200).json({ data: task, message: "Task Created Success" });
};

const getTodaysTask = AsyncHandler(async (req, res) => {
  try {
    const date = new Date().toLocaleDateString();

    const taskNC = await Task.find({
      assignedTo: req.user._id,
    })


 //to add pending task
    taskNC.map(async(v) => {

      
      if ( date !== v.assignedDate && (v.status === "N/A" || v.status === "In Progress")) {
        
        const taskExist = await PendingTask.find({ task: v._id });
        

        if(!taskExist || taskExist.length === 0){
          // console.log("Not Match exists")
          await PendingTask.create({ task: v._id });
        }
      }
    });


    const task = await Task.find({
      $and: [
        {
          assignedTo: req.user._id,
        },
        {
          assignedDate: date,
        },
      ],
    })
      // .populate("assignedTo", "firstName lastName email")
      .populate("project", "title description startDate endDate");

    if (!task) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    return res.status(200).json({ data: task });
  } catch (error) {
    return res.status(400).json({ message: error?.message });
  }
});

//Admin
const getAllTask = AsyncHandler(async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(400).json({ message: "Sorry!!! Your Role Not Match" });
    }

    const task = await Task.find()
      .populate("assignedTo", "firstName lastName email")
      .populate("project", "title description startDate endDate")
      .populate("createdBy", "firstName lastName email");

    if (!task) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    return res.status(200).json({ data: task });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

const getTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId)
      .populate("assignedTo", "firstName lastName email")
      .populate("project", "title description startDate endDate");

    if (!task) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    return res.status(200).json({ data: task });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

//Admin
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo , assignedDate, project , dueTime , status} = req.body;

  try {

    if (req.user.role !== "Admin" && "Project Manager") {
      return res
        .status(400)
        .json({ message: "Sorry!!! You cannot Create Task" });
    }

    if (!taskId) {
      return res.status(400).json({ message: "Task Not Found" });
    }


    const userExists = await User.findOne({ _id: req.user._id });

    if (!userExists) {
      return res.status(400).json({ message: "User is Invalid" });
    }

    // const projectExists = await Project.findOne({title: project});

    // const userExists = await User.findOne({firstName: assignedTo});

    // console.log(userExists);

    const taskExists = await Task.findById(taskId);

    if (!taskExists) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    const assignedToExists = await User.findOne({ _id: assignedTo });

    if (!assignedToExists) {
      return res.status(400).json({ message: "Assigned Member is Invalid" });
    }
  
    const projectIdExists = await Project.findOne({ _id: project });
  
    if (!projectIdExists) {
      return res.status(400).json({ message: "Project Id is Invalid" });
    }

    const date = new Date(assignedDate).toLocaleDateString();

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: {
          title,
          description,
          assignedDate : date,
          assignedTo: assignedToExists._id,
          project: projectIdExists._id,
          changesBy: userExists._id,
          dueTime,
          status
        },
      },
      {
        new: true,
      }
    );

    if (!task) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong While Updating Task" });
    }

    return res.status(200).json({ data: task, message: "Task Update Success" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

//Admin
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    if (req.user.role !== "Admin" && "Project Manager") {
      return res
        .status(400)
        .json({ message: "Sorry!!! You cannot Create Task" });
    }

    if (!taskId) {
      return res.status(400).json({
        message: "Task Id is Invalid",
      });
    }

    const taskExists = await Task.findById(taskId);

    if (!taskExists) {
      return res.status(400).json({
        message: "Task Not Found",
      });
    }

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.json({ message: "Something Went Wrong While Deleting Task" });
    }

    return res.status(200).json({
      message: "Task Deleted Success",
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const startToggle = async (req, res) => {
  const { taskId } = req.params;

  try {
    if (!taskId) {
      return res.status(400).json({ message: "Task Id is Invalid" });
    }

    const taskExists = await Task.findById(taskId);

    if (!taskExists) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    if (taskExists.status === "In Progress") {
      return res.status(400).json({ message: "Task Already Started" });
    } else {
      const date = new Date();

      const startTask = await Task.findByIdAndUpdate(
        taskId,
        {
          $set: {
            status: "In Progress",
            startTime: date.toLocaleTimeString(),
          },
        },
        { new: true }
      );

      if (!startTask) {
        return res
          .status(400)
          .json({ message: "Something Went Wrong While Getting Status" });
      }

      return res.status(200).json({ message: "Task Started Success" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const completedToggle = async (req, res) => {
  const { taskId } = req.params;

  try {
    if (!taskId) {
      return res.status(400).json({ message: "Task Id is Invalid" });
    }

    const taskExists = await Task.findById(taskId);

    if (!taskExists) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    if (taskExists.status === "Completed") {
      return res.status(400).json({ message: "Task Already Ended" });
    } else {
      const date = new Date();

      const completed = await Task.findByIdAndUpdate(
        taskId,
        {
          $set: {
            status: "Completed",
            endTime: date.toLocaleTimeString(),
          },
        },
        { new: true }
      );

      if (!completed) {
        return res
          .status(400)
          .json({ message: "Something Went Wrong While Getting Status" });
      }

      const addCompletedTaskAlready = await CompletedTask.findOne({ task: taskId });

      if(!addCompletedTaskAlready || addCompletedTaskAlready.length === 0){
        await CompletedTask.create({ task: taskId });
        await PendingTask.deleteOne({ task: taskId })
      }else{
        return res.status(400).json({ message: "Task Already Added" });
      }


      return res.status(200).json({ message: "Task Completed Success" });
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export {
  createTask,
  getTodaysTask,
  getTask,
  updateTask,
  deleteTask,
  completedToggle,
  startToggle,
  getAllTask,
};

import { CompletedTask } from "../Models/completedTask.model.js";
import { Task } from "../Models/task.model.js";

const getAllCompletedTask = async (req, res) => {
  try {
    const task = await Task.find({ assignedTo: req.user._id });

    const completedIds = task.map((completT) => completT._id);

    const completedTask = await CompletedTask.find({
      task: { $in: completedIds },
    }).populate("task", "title description status assignedTo dueTime project startTime endTime");

    return res.status(200).json({ data: completedTask });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export { getAllCompletedTask };

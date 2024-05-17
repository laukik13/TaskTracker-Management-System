import { PendingTask } from "../Models/pendingTask.model.js";
import { Task } from "../Models/task.model.js";

const getAllPendingTask = async (req, res) => {
  try {
    const pending = await Task.find({ assignedTo: req.user._id });

    const pendingIds = pending.map((pendingT) => pendingT._id);

    const pendingTask = await PendingTask.find({
      task: { $in: pendingIds },
    }).populate("task", "title description status assignedTo dueTime project");

    return res.status(200).json({ data: pendingTask });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export { getAllPendingTask };

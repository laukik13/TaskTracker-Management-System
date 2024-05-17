import { Comment } from "../Models/comment.model.js";
import { Project } from "../Models/project.model.js";
import { Task } from "../Models/task.model.js";
import { User } from "../Models/user.model.js";

const createComment = async (req, res) => {
  const { content, task } = req.body;

  try {
    if ([content, task].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "Fields Are Empty" });
    }

    const taskExists = await Task.findOne({ _id: task });

    if (!taskExists) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    const commentbyExists = await User.findOne({ _id: req.user._id });

    if (!commentbyExists) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const comment = await Comment.create({
      content,
      task: taskExists._id,
      commentby: commentbyExists._id,
    });

    if (!comment) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong While Creating Comment" });
    }

    return res
      .status(200)
      .json({ data: comment, message: "Comment Created Success" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

//Admin & Project Manager & User
// const getAllComment = async (req, res) => {
//   try {
//     let comment;

//     if(req.user.role === "Team Member"){
//        comment = await Comment.find({commentby: req.user._id})
//       .populate("task", "title")
//       .populate("commentby", "firstName lastName email role");

//     if (!comment || comment.length === 0 ) {
//       return res.status(400).json({ message: "Comment Not Found" });
//     }
//     }

//     if (req.user.role === "Project Manager") {
//       // Fetch tasks created by the current user
//       const tasks = await Task.find({ createdBy: req.user._id });

//       // Extract task ids
//       const taskIds = tasks.map(task => task._id);

//       // Find comments associated with these tasks
//       comment = await Comment.find({ task: { $in: taskIds } })
//         .populate("task", "title")
//         .populate("commentby", "firstName lastName email role");

//       if (!comment || comment.length === 0) {
//         return res.status(400).json({ message: "Comments Not Found" });
//       }
//     }

//     if(req.user.role === "Admin"){
//       comment = await Comment.find()
//       .populate("task", "title")
//       .populate("commentby", "firstName lastName email role");

//     if (!comment) {
//       return res.status(400).json({ message: "Comment Not Found" });
//     }
//    }

//     return res.status(200).json({ data: comment });
//   } catch (error) {
//     return res.status(400).json({ message: error });
//   }
// };

const getAllComment = async (req, res) => {
  try {
    let comment;

    if (req.user.role === "Team Member") {
      // Find comments made by the current user
      comment = await Comment.find({ commentby: req.user._id })
        .populate("task", "title")
        .populate("commentby", "firstName lastName email role");

      if (!comment || comment.length === 0) {
        return res.status(400).json({ message: "Comment Not Found" });
      }

      // Fetch projects where the current user is a team member
      const projects = await Project.find({ teamMembers: req.user._id });

      // Extract project ids
      const projectIds = projects.map((project) => project._id);

      // Find comments associated with these projects
      const projectComments = await Comment.find({ task: { $in: projectIds } })
        .populate("task", "title")
        .populate("commentby", "firstName lastName email role");

      // Merge project comments with the user's own comments
      comment = [...comment, ...projectComments];
    }

    if (req.user.role === "Project Manager") {
      // Fetch tasks created by the current user
      const tasks = await Task.find({ createdBy: req.user._id });

      // Extract task ids
      const taskIds = tasks.map((task) => task._id);

      // Find comments associated with these tasks
      comment = await Comment.find({ task: { $in: taskIds } })
        .populate("task", "title")
        .populate("commentby", "firstName lastName email role");

      if (!comment || comment.length === 0) {
        return res.status(400).json({ message: "Comments Not Found" });
      }
    }

    if (req.user.role === "Admin") {
      comment = await Comment.find()
        .populate("task", "title")
        .populate("commentby", "firstName lastName email role");

      if (!comment) {
        return res.status(400).json({ message: "Comment Not Found" });
      }
    }

    return res.status(200).json({ data: comment });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId)
      .populate("task", "title")
      .populate("commentby", "firstName lastName email role");

    if (!comment) {
      return res.status(400).json({ message: "Comment Not Found" });
    }

    return res.status(200).json({ data: comment });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content, task } = req.body;

  try {
    if (!commentId) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    const commentExists = await Comment.findById(commentId);

    if (!commentExists) {
      return res.status(400).json({ message: "Task Not Found" });
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content,
          task,
        },
      },
      {
        new: true,
      }
    );

    if (!comment) {
      res
        .status(400)
        .json({ message: "Something Went Wrong While Updating Comment" });
    }

    return res
      .status(200)
      .json({ data: comment, message: "Comment Update Success" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

//Admin & Project Manager
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    if (!commentId) {
      return res.status(400).json({
        message: "Comment Id is Invalid",
      });
    }

    const commentExists = await Comment.findById(commentId);

    if (!commentExists) {
      return res.status(400).json({
        message: "Comment Not Found",
      });
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      res.json({ message: "Something Went Wrong While Deleting Task" });
    }

    return res.status(200).json({
      message: "Comment Deleted Success",
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const createReply = async (req, res) => {
  const { reply, comment } = req.body;

  try {
    if ([reply, comment].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "Fields Are Empty" });
    }

    const commentExists = await Comment.findById(comment);

    // console.log(commentExists);

    if (!commentExists) {
      return res.status(400).json({ message: "Comment Not Found" });
    }

    const replyByExists = await User.findById(req.user._id);

    if (!replyByExists) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const replycomment = {
      reply,
      replyBy: {
        _id: replyByExists._id,
        firstName: replyByExists.firstName,
        lastName: replyByExists.lastName,
        email: replyByExists.email,
        role: replyByExists.role,
      }
    };

    console.log(replycomment);

    // Check if the comment already has replies, if not, create a new array to store replies
    if (!commentExists.replies) {
      commentExists.replies = [];
    }

    // Add the new reply to the comment's replies array
    commentExists.replies.push(replycomment);

    // Save the updated comment
    await commentExists.save();

    return res
      .status(200)
      .json({ data: commentExists, message: "Reply Created Success" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

//   const addCommentToReply = async (req, res) => {
//     const { replyId, subReplyId } = req.params;
//     const { content, commentby } = req.body;

//     try {
//         let parentReply;

//         if (subReplyId) {
//             parentReply = await Comment.findOne({ "replies._id": subReplyId });
//             if (!parentReply) {
//                 return res.status(404).json({ message: "Parent reply not found" });
//             }
//         } else if (replyId) {
//             parentReply = await Comment.findById(replyId);
//             if (!parentReply) {
//                 return res.status(404).json({ message: "Parent reply not found" });
//             }
//         } else {
//             return res.status(400).json({ message: "Please provide either replyId or subReplyId" });
//         }

//         const parentIndex = parentReply.replies.findIndex(reply => reply._id.toString() === (subReplyId || replyId));

//         if (parentIndex === -1) {
//             return res.status(404).json({ message: "Parent reply not found" });
//         }

//         // Create the comment
//         const comment = {
//             content,
//             commentby: commentby // Assuming commentby is the ObjectId of the user
//         };

//         // Push the comment into the replies array of the parent reply document
//         parentReply.replies[parentIndex].replies.push(comment);

//         // Save the updated parent reply document
//         await parentReply.save();

//         return res.status(200).json({ message: "Comment added successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };

export {
  createComment,
  getAllComment,
  getComment,
  updateComment,
  deleteComment,
  createReply,
};

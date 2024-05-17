import { Comment } from "../Models/comment.model.js";
import { ReplyComment } from "../Models/reply.model.js";
import { User } from "../Models/user.model.js";
import { AsyncHandler } from "../Utils/asyncHandler.js";

const addReplyToComment = AsyncHandler(async (req, res) => {
  // get reply , replyby , comment
  // check entrer field is empty
  // replyby is exists in user
  // check comment exists in comment database
  // save reply in database

  const { reply, comment } = req.body;

  try {
    
    if ([reply,comment].some((field) => field?.trim() === "")) {
        return res.status(400).json({ message: "Fields Are Empty" });
      }
  
      const userExists = await User.findById(req.user._id);
  
      if(!userExists){
        return res.status(400).json({ message: "User Not Found" });
      }

      const commentExists = await Comment.findById(comment);

      if(!commentExists){
        return res.status(400).json({message: "Comment Not Found"})
      }

        const replyComment = await ReplyComment.create({
            reply,
            replyBy: userExists._id,
            comment: commentExists._id
         })      
    
         if(!replyComment){
           return res.status(500).json({message: "Something Went Wrong while adding Reply"})
         }
    
         return res.status(200).json({data:replyComment,message:"Reply Add Success"});

  } catch (error) {
    res.status(500).json({message: error.message})
  }
   

});


// const addSubReplytoComment = AsyncHandler(async (req, res) => {
//     // get reply , replyby , comment
//     // check entrer field is empty
//     // replyby is exists in user
//     // check comment exists in comment database
//     // save reply in database
  
//     const { reply, replyId } = req.body;
  
//     try {
      
//       if ([reply,replyId].some((field) => field?.trim() === "")) {
//           return res.status(400).json({ message: "Fields Are Empty" });
//         }
    
//         const userExists = await User.findById(req.user._id);
    
//         if(!userExists){
//           return res.status(400).json({ message: "User Not Found" });
//         }
  
//         const ReplyExists = await ReplyComment.findById(replyId);

//         // console.log(ReplyExists);
  
//         if(!ReplyExists){
//           return res.status(400).json({message: "Reply Not Found"})
//         }
  
//           const subreplyComment = await ReplyComment.create({
//               reply,
//               replyBy: userExists._id,
//               replyId: ReplyExists._id
//            })      
      
//            if(!subreplyComment){
//              return res.status(500).json({message: "Something Went Wrong while adding Reply"})
//            }
      
//            return res.status(200).json({data:subreplyComment,message:"Sub Reply Add Success"});
  
//     } catch (error) {
//       res.status(500).json({message: error.message})
//     }
     
  
//   });


const getAllReplycomment = AsyncHandler(async(req,res)=>{
   
  try {
    
    // const pending = await Task.find({ assignedTo: req.user._id });

    // const pendingIds = pending.map((pendingT) => pendingT._id);

    // const pendingTask = await PendingTask.find({
    //   task: { $in: pendingIds },
    // }).populate("task", "title description status assignedTo dueTime project");

    return res.status(200).json({ data: pendingTask });
  } catch (error) {
    return res.status(400).json({ message: error });
  }

});


export { addReplyToComment , getAllReplycomment 
  // addSubReplytoComment 
};

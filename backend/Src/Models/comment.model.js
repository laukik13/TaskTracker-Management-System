import mongoose from "mongoose";
import { Schema } from "mongoose";

const replyCommentScheam = new Schema(
    {
      reply: {
        type: String,
        required: true,
      },
      replyBy:{ 
        type: Object,
      }
      ,
      comment:{
          type:Schema.Types.ObjectId,
          ref:"Comment",
      },
    //   replyId:{
    //     type:Schema.Types.ObjectId,
    //     ref:"ReplyComment",
    // }
    },
    { timestamps: true }
  );
  

const commentSchema = new Schema({
    content:{
        type: String,
        required: true,
        trim: true,
    },
    task:{
        type: Schema.Types.ObjectId,
        ref:"Task"
    },
    commentby:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    replies: [replyCommentScheam]
},{
    timestamps: true
})

export const Comment = mongoose.model("Comment",commentSchema);

// import mongoose from "mongoose";
// const Schema = mongoose.Schema;

// // Define the reply schema
// const replySchema = new Schema({
//     content:{
//         type: String,
//         required: true,
//         trim: true,
//     },
//     replyBy:{
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     },
//     replies: [] // Array to store nested replies
// }, { timestamps: true });

// // Define the comment schema
// const commentSchema = new Schema({
//     content:{
//         type: String,
//         required: true,
//         trim: true,
//     },
//     task:{
//         type: Schema.Types.ObjectId,
//         ref: "Task"
//     },
//     commentby:{
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     },
//     replies: [replySchema] // Array to store replies and sub-replies
// }, { timestamps: true });

// // Create the Comment model using the comment schema
// export const Comment = mongoose.model("Comment", commentSchema);
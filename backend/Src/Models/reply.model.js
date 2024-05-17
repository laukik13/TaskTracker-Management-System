import mongoose from "mongoose";
import { Schema } from "mongoose";

const replyCommentScheam = new Schema(
  {
    reply: {
      type: String,
      required: true,
    },
    replyBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment",
    },
    replyId:{
      type:Schema.Types.ObjectId,
      ref:"ReplyComment",
  }
  },
  { timestamps: true }
);


export const ReplyComment = mongoose.model("ReplyComment",replyCommentScheam);
import mongoose from "mongoose";
import { Schema } from "mongoose";

const completedTaskScheam = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    }
  },
  { timestamps: true }
);


export const CompletedTask = mongoose.model("CompletedTask",completedTaskScheam);
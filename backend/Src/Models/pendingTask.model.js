import mongoose from "mongoose";
import { Schema } from "mongoose";

const pendingTaskScheam = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    }
  },
  { timestamps: true }
);


export const PendingTask = mongoose.model("PendingTask",pendingTaskScheam);
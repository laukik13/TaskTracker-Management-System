import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
        required: true,
      },
      status:{
        type:String,
        enum:['Completed','In Progress','On Hold','N/A'],
        default:"N/A"
      },
      assignedTo:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      assignedDate:{
        type: String,
        required: true,
      },
      dueTime:{
       type: String,
        required: true,
      }, 
      project:{
        type: Schema.Types.ObjectId,
        ref: "Project"
      },
      startTime:{
        type: String,
      },
      endTime:{
        type: String,
      },
      createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      changesBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true,
      }
},{
    timestamps: true
})

export const Task = mongoose.model('Task',taskSchema);
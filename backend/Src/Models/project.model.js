import mongoose from "mongoose";
import { Schema } from "mongoose";
import { User } from "./user.model.js";

const projectSchema = new Schema(
  {
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
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    status:{
      type:String,
      enum:['Completed','In Progress','On Hold','N/A'],
      default:"N/A"
    },
    projectManager:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate:{
            validator: async function (v) {
                const user = await User.findById(v);
                return ['Admin','Project Manager'].includes(user.role);
            },
            message: (props)=>{
                `User role must be either 'Admin' or 'Project Manager'`
            }
        }
    },
    teamMembers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
  },
  {
    timestamps: true,
  }
);


export const Project = mongoose.model("Project",projectSchema); 

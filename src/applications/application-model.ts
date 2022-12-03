import mongoose, { model, Schema } from "mongoose";
import { ApplicationDto } from "./application";

const applicaionSchema = new Schema<ApplicationDto>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "An application must have a employeeId"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "An application must have a jobId"],
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "An application must have an employerId"],
    },
    status: {
      type: String,
      enum: ["shortListed", "accepted", "rejected", "applied"],
      default: "applied",
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

const Application = model("Application", applicaionSchema);

export default Application;

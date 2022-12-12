import mongoose, { Schema, model } from "mongoose";
import { JobDto } from "./job.dto";

const jobSchema = new Schema<JobDto>(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: [true, "A job must have an employer"],
    },
    companyName: {
      type: String,
      required: [true, "A job should have a company name"],
    },
    title: {
      type: String,
      required: [true, "Please enter the job title"],
    },
    skill: {
      type: String,
      required: [true, "Please enter the job skill"],
      enum: [
        "frontend developer",
        "backend developer",
        "UI/UX designer",
        "product designer",
        "full stack developer",
      ],
    },
    location: {
      type: String,
      required: [true, "Please enter the job location"],
      enum: ["Lagos", "Abuja", "Ogun", "Jos"],
    },
    keyword: {
      type: String,
      required: [true, "Please enter the job location"],
      enum: [
        "Nodejs",
        "TypeScript",
        "Nestjs",
        "Figma",
        "Express",
        "HTML",
        "CSS",
        "JAVASCRIPT",
        "Adobe",
        "JQUERY",
        "BOOTSTRAP",
      ],
    },
    description: {
      type: String,
      required: [true, "Please enter the job description"],
    },
    address: {
      type: String,
    },
    jobType: {
      type: String,
      required: [true, "Please enter the job type"],
      enum: ["Remote", "Physical", "Hybrid"],
    },
    workType: {
      type: String,
      required: [true, "Please enter the work type"],
      enum: ["Full Time", "Part Time"],
    },

    isAvailable: {
      type: Boolean,
      required: [true, "A job must have an availability field "],
      default: true,
    },
    salary: String,
    yearOfExperience: {
      type: String,
      required: [true, "The year(s) of experience should be stated"],
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

const Job = model("Job", jobSchema);

export default Job;

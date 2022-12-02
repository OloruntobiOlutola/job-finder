import mongoose, { model, Schema } from "mongoose";
import { ProfileDto } from "./profile.dto";

const profileSchema = new Schema<ProfileDto>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A profile must belong to a user"],
    },
    cv: String,
    skill: {
      type: [String],
      enum: [
        "frontend developer",
        "backend developer",
        "UI/UX designer",
        "product designer",
        "full stack developer",
        "technical writer",
      ],
      required: [true, "An employee should provide skill(s)"],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "An employee should provide years of experience"],
    },
    address: String,
    linkedlnUrl: String,
    githubUrl: String,
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

const Profile = model("Profile", profileSchema);

export default Profile;

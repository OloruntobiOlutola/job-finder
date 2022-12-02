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
      type: String,
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
      type: String,
      required: [true, "An employee should provide years of experience"],
    },
    address: String,
    linkedlnUrl: {
      type: String,
      validate: {
        validator: function (val: string) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            val
          );
        },
        message: "Not a url",
      },
    },
    githubUrl: {
      type: String,
      validate: {
        validator: function (val: string) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            val
          );
        },
        message: "Not a url",
      },
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

const Profile = model("Profile", profileSchema);

export default Profile;

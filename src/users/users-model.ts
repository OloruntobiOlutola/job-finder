import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserDto } from "./user.dto";

const userSchema = new Schema<UserDto>(
  {
    name: String,

    email: String,

    password: {
      type: String,
      select: false,
    },

    skills: [String],

    experience: Number,

    location: String,

    passwordConfirm: String,

    phoneNumber: String,

    role: String,

    passwordResetToken: String,

    passwordChangedAt: Date,

    passwordTokenExpires: Date,
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  let salt = await bcrypt.genSalt(10);
  // @ts-ignore
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changePasswordAfter = function (
  JWTTimestamp: Date
): boolean {
  if (this.passwordChangedAt) {
    console.log(JWTTimestamp < this.passwordChangedAt);
    return JWTTimestamp < this.passwordChangedAt;
  }
  return false;
};

const User = model("User", userSchema);

export default User;

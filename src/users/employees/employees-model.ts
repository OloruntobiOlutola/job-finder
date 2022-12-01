import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import UserSchema from "../users-schema";
import { UserDto } from "../user.dto";

const role = {
  type: String,
  default: "employee",
};

const employeeSchema = new Schema<UserDto>(
  // @ts-ignore
  {
    ...UserSchema,
    role,
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

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  let salt = await bcrypt.genSalt(10);
  // @ts-ignore
  this.password = await bcrypt.hash(this.password, salt);
  // @ts-ignore
  this.passwordConfirm = undefined;
  next();
});

employeeSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

employeeSchema.methods.changePasswordAfter = function (
  JWTTimestamp: Date
): boolean {
  if (this.passwordChangedAt) {
    console.log(JWTTimestamp < this.passwordChangedAt);
    return JWTTimestamp < this.passwordChangedAt;
  }
  return false;
};

const Employee = model("Employee", employeeSchema);

export default Employee;

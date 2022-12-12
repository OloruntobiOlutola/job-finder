import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "validator";
import { UserDto } from "./user.dto";

const TENMINUTES = 10 * 60 * 1000;
const ONEDAY = 24 * 60 * 60 * 1000;

const userSchema = new Schema<UserDto>(
  {
    name: {
      type: String,
      required: [true, "The name field is required"],
      maxLength: [30, "A name must not be more than 30 characters"],
      minLength: [3, "A name must be at least 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email field is required for all users"],
      validate: [validator.isEmail, "Please enter a valid email"],
      unique: [true],
    },

    password: {
      type: String,
      required: [true, "A user must have an password"],
      select: false,
      minLength: [8, "Password must ba at least 8 characters"],
      validate: {
        validator: function (val: string) {
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/.test(val);
        },
        message:
          "Password must contain at least a number, a lowercase and an uppercase alphabeth",
      },
    },

    passwordConfirm: {
      type: String,
      required: [true, "A user must have an passwordConfirm"],
      validate: {
        validator: function (val: string): boolean {
          // @ts-ignore
          return val === this.password;
        },
        message: "Password and confirm password are different",
      },
      select: false,
    },

    phoneNumber: {
      type: String,
      validate: {
        validator: function (val: string) {
          return /[0]{1}[0-9]{10}/.test(val);
        },
        message: "Please enter a valid phone number",
      },
    },

    role: {
      type: String,
      enum: ["employee", "employer", "admin"],
      default: "employee",
    },

    passwordResetToken: String,

    passwordChangedAt: Date,

    passwordTokenExpires: Date,

    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    status: {
      type: Boolean,
      default: false,
    },
    confirmationCode: String,

    confirmationCodeExpires: Date,
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

userSchema.pre(/^findOne/, function (next) {
  this.populate("profile");
  next();
});

userSchema.pre("save", async function (next) {
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

userSchema.methods.createToken = function (type: string): string {
  const token = crypto.randomBytes(32).toString("hex");

  if (type === "confirm") {
    this.confirmationCode = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    this.confirmationCodeExpires = Date.now() + ONEDAY;
  } else {
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    this.passwordTokenExpires = Date.now() + TENMINUTES;
  }
  return token;
};

userSchema.methods.changePasswordAfter = function (
  JWTTimestamp: Date
): boolean {
  if (this.passwordChangedAt) {
    return JWTTimestamp < this.passwordChangedAt;
  }
  return false;
};

const User = model("User", userSchema);

export default User;

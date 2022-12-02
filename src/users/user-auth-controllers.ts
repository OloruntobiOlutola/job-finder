import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import * as jwt from "jsonwebtoken";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import { UserDto } from "./user.dto";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/email";
import crypto from "crypto";
import { HydratedDocument } from "mongoose";
import User from "./users-model";

const { JWT_COOKIE_EXPIRES_IN, JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } =
  process.env;

const signToken = (id: string | undefined) => {
  return jwt.sign({ id }, JWT_SECRET || "my secret", {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const createAndSendToken = catchAsync(
  async (user: UserDto, statusCode: number, res: Response) => {
    const token = await signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(JWT_COOKIE_EXPIRES_IN || "1") * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: false,
    };
    if (NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;
    res.status(statusCode).json({
      status: "success",
      token,
      user,
    });
  }
);

// Sign Up User
export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password, passwordConfirm, role, phoneNumber } =
      req.body;
    const user: HydratedDocument<UserDto> = await User.create({
      email,
      name,
      password,
      passwordConfirm,
      role,
      phoneNumber,
    });
    // @ts-ignore
    createAndSendToken(user, 201, res);
  }
);

// Sign In User
export const signIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorObject("Please enter your email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorObject("Invalid email or password", 401));
    }
    const confirmPassword = await bcrypt.compare(
      password,
      user.password ? user.password : "pass"
    );
    if (!confirmPassword || !user) {
      return next(new ErrorObject("Invalid email or password", 401));
    }
    //   @ts-ignore
    createAndSendToken(user, 200, res);
  }
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get User based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ErrorObject("There is no user with the provided email address", 404)
      );
    }
    // 2. Generate random reset token
    //   @ts-ignore
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3. Send token to the email addess
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;

    const message = `To reset your password click on the link below to submit your new password: ${resetUrl}`;

    try {
      await sendEmail({
        message,
        email: user.email || "email",
        subject: "Your password reset url. It's valid for 10mins",
      });

      res.status(200).json({
        status: "success",
        message: "Token has been sent to your mail",
        resetUrl,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordTokenExpires = undefined;
      await user.save();
      next(new ErrorObject("Error while sending the token to your mail", 500));
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashToken,
      passwordTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorObject("Token is invalid or it has expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save({ validateBeforeSave: true });
    // @ts-ignore
    createAndSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user: HydratedDocument<UserDto> = await User.findById(
      req.user?.id
    ).select("+password");
    const { newPassword, newPasswordConfirm } = req.body;
    // @ts-ignore
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return next(new ErrorObject("Your password is incorrect", 401));
    }

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save({ validateBeforeSave: true });

    // @ts-ignore
    createAndSendToken(user, 200, res);
  }
);

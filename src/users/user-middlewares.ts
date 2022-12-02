import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import * as jwt from "jsonwebtoken";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import { rolesType } from "./types";
import userValidation from "./user-validation";
import User from "./users-model";

export const validateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
    };

    const { error } = await userValidation.validateAsync({ ...payload });
    if (error) {
      return next(
        new ErrorObject(`Error in User Data : ${error.message}`, 406)
      );
    }
    next();
  }
);

// Authorization
export const restrictTo = (...roles: rolesType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "string")) {
      return next(
        new ErrorObject("You are not authorised to perform this action.", 403)
      );
    }
    next();
  };
};

// Authentication
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new ErrorObject("You are not logged in. Kindly log in.", 401)
      );
    }

    const decodedToken: any = await jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );

    const currentUser = await User.findById(decodedToken.id);

    if (!currentUser) {
      return next(new ErrorObject("Incorrect access token", 401));
    }

    req.user = currentUser;
    next();
  }
);

export const sameUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.id !== req.params.id) {
      return next(
        new ErrorObject(`You're not authorised to perform this action`, 403)
      );
    }
    next();
  }
);

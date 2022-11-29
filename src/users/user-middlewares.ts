import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import { rolesType } from "./types";
import userValidation from "./user-validation";
import User from "./users-model";

export const validateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = { ...req.body };

    const { error } = userValidation.validate(payload);
    if (error) {
      return next(
        new ErrorObject(`Error in User Data : ${error.message}`, 406)
      );
    }
    next();
  }
);

// Authorization
exports.restrictTo = (...roles: rolesType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!roles.includes(req.user.role)) {
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

    //   @ts-ignore
    req.user = currentUser;
    next();
  }
);

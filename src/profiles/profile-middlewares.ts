import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import Profile from "./profile-model";

export const sameProfileOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await Profile.findById(req.params.id);
    if (req.user?.id !== profile?.userId?.toString()) {
      return next(
        new ErrorObject(`You're not authorised to perform this action`, 403)
      );
    }
    next();
  }
);

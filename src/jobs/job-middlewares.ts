import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import Profile from "../profiles/profile-model";
import Job from "./job-model";

export const sameEmployer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const job = await Job.findById(req.params.id);
    if (req.user?.id !== job?.employerId?.toString()) {
      return next(
        new ErrorObject(`You're not authorised to perform this action`, 403)
      );
    }
    next();
  }
);

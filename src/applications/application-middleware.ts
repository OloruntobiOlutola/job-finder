import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import Application from "./application-model";

export const sameJobOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const application = await Application.findById(req.params.id);
    if (req.user?.id !== application?.employerId?.toString()) {
      return next(
        new ErrorObject(`You're not authorised to perform this action`, 403)
      );
    }
    next();
  }
);

export const sameJobApplicant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const application = await Application.findById(req.params.id);
    if (req.user?.id !== application?.employeeId?.toString()) {
      return next(
        new ErrorObject(`You're not authorised to perform this action`, 403)
      );
    }
    next();
  }
);

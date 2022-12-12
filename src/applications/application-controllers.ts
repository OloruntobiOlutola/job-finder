import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import { deleteOne, getOne, updateOne } from "../../utils/generic-controllers";
import Job from "../jobs/job-model";
import Application from "./application-model";

export const updateApplication = updateOne(Application);

export const getApplicationsByJobOwnerForAJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const applications = await Application.find({ jobId: req.params.id });
    const job = await Job.findById(req.params.id);
    if (req.user?.id !== job?.employerId?.toString()) {
      return next(
        new ErrorObject(`You're not authorised to perform this action`, 403)
      );
    }

    res.status(200).json({
      status: "success",
      data: applications,
    });
  }
);

export const getAllApplicationsByJobOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const applications = await Application.find({
      employerId: req.user?.id,
    });

    res.status(200).json({
      status: "success",
      data: applications,
    });
  }
);

export const getApplicationsByApplicant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const applications = await Application.find({ employeeId: req.user?.id });

    res.status(200).json({
      status: "success",
      data: applications,
    });
  }
);

export const getApplication = getOne(Application);

export const createApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.employeeId = req.user?.id;
    const application = await Application.create(req.body);

    res.status(201).json({
      status: "success",
      data: application,
    });
  }
);

export const deleteApplication = deleteOne(Application);

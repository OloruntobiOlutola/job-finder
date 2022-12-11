import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../../utils/generic-controllers";
import Profile from "../profiles/profile-model";
import User from "../users/users-model";
import Job from "./job-model";

export const getJob = getOne(Job);

export const getJobs = getAll(Job);

export const updateJob = updateOne(Job);

export const deleteJob = deleteOne(Job);

export const createJob = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.employerId = req.user?.id;
    const job = await Job.create(req.body);

    res.status(201).json({
      status: "success",
      job,
    });
  }
);

export const recommendedJobsHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userProfile = await Profile.findOne({ userId: req.user?.id });
    if (!userProfile) {
      return next(new ErrorObject("Please create your profile", 400));
    }

    const recommendedJobs = await Job.find({
      skill: userProfile.skill,
      yearOfExperience: userProfile.yearsOfExperience,
    });

    if (!recommendedJobs) {
      return next(new ErrorObject("No job for your profile", 400));
    }

    res.status(200).json({
      status: "success",
      data: recommendedJobs,
    });
  }
);

export const recommendedEmployeesHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return next(new ErrorObject("No job with the requested Id", 400));
    }

    const recommendedEmployers = await User.find({
      skill: job.skill,
      yearsOfExperience: job.yearOfExperience,
    });

    if (!recommendedEmployers) {
      return next(
        new ErrorObject("No employee meets the job requirement", 400)
      );
    }

    res.status(200).json({
      status: "success",
      data: recommendedEmployers,
    });
  }
);

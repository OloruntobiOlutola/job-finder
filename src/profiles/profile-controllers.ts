import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import { catchAsync } from "../../utils/catch-async";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
} from "../../utils/generic-controllers";
import { UserDto } from "../users/user.dto";
import User from "../users/users-model";
import Profile from "./profile-model";

export const updateProfile = updateOne(Profile);

export const getProfile = getOne(Profile);

export const getProfiles = getAll(Profile);

export const createProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.userId = req.user?.id;
    const profile = await Profile.create(req.body);
    // @ts-ignore
    const user: HydratedDocument<UserDto> = await User.findById(req.user?.id);

    user.hasProfile = true;
    user.save();

    res.status(201).json({
      status: "success",
      profile,
    });
  }
);

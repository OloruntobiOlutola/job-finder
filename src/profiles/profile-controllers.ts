import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";
import multer from "multer";
import { catchAsync } from "../../utils/catch-async";
import cloudUpload from "../../utils/cloudinary";
import { ErrorObject } from "../../utils/error";
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

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: CallableFunction) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    return "Please upload only an image file";
  }
};

const uploadCV = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadEmployeeCV = uploadCV.single("cv");

export const cvFormatter = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      let id = req.user?.id;
      const user = await User.findById(id);
      if (!user) {
        return next(
          new ErrorObject(`There is no user with the ${req.params.id}`, 400)
        );
      }
      const image = {
        url: req.file.path,
        id: req.params.id,
      };
      const result = await cloudUpload(image);
      req.body.cv = result.secure_url;
    }
    next();
  }
);

export const createProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.userId = req.user?.id;
    const profile = await Profile.create(req.body);
    // @ts-ignore
    const user: HydratedDocument<UserDto> = await User.findById(req.user?.id);

    user.profile = profile.id;
    user.save();

    res.status(201).json({
      status: "success",
      profile,
    });
  }
);

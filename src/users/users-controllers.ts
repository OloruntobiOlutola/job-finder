import { NextFunction, Response, Request } from "express";
import { catchAsync } from "../../utils/catch-async";
import { ErrorObject } from "../../utils/error";
import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../../utils/generic-controllers";
import Profile from "../profiles/profile-model";
import User from "./users-model";

export const getUser = getOne(User);

export const getUsers = getAll(User);

export const updateUser = updateOne(User);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const myProfile = await Profile.findOne({ userId: req.user?.id });
    if (myProfile) {
      await Profile.findOneAndDelete({ userId: req.user?.id });
    }
    const user = await User.findByIdAndDelete(req.params.id, {
      strict: true,
    });
    if (!user)
      return next(
        new ErrorObject(`User with the id ${req.params.id} not found`, 404)
      );
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

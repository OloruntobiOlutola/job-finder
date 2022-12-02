import { createOne, getOne, updateOne } from "../../utils/generic-controllers";
import Profile from "./profile-model";

export const createProfile = createOne(Profile);

export const updateProfile = updateOne(Profile);

export const getProfile = getOne(Profile);

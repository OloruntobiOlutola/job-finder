import { deleteOne, getAll, getOne } from "../../utils/generic-controllers";
import User from "./users-model";

export const getUser = getOne(User);

export const getUsers = getAll(User);

export const deleteUser = deleteOne(User);

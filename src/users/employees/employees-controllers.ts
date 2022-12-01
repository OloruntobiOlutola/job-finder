import {
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../../../utils/generic-controllers";
import {
  forgotPassword,
  resetPassword,
  signIn,
  signUp,
  updatePassword,
} from "../user-auth-controllers";
import { protect, samePerson, validateUser } from "../user-middlewares";
import Employee from "./employees-model";

export const getEmployee = getOne(Employee);

export const getEmployees = getAll(Employee);

export const deleteEmployee = deleteOne(Employee);

export const signUpEmployee = signUp(Employee);

export const signInEmployee = signIn(Employee);

export const employeeForgotPassword = forgotPassword(Employee);

export const employeeResetPassword = resetPassword(Employee);

export const employeeUpdatePassword = updatePassword(Employee);

export const validateEmployee = validateUser(Employee);

export const updateEmployee = updateOne(Employee);

export const sameEmployee = samePerson(Employee);

export const protectEmployee = protect(Employee);

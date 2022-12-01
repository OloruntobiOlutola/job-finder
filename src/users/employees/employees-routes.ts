import { Router } from "express";
import { signIn, signUp } from "../user-auth-controllers";
import {
  deleteEmployee,
  employeeForgotPassword,
  employeeResetPassword,
  employeeUpdatePassword,
  getEmployee,
  getEmployees,
  protectEmployee,
  sameEmployee,
  signInEmployee,
  signUpEmployee,
  updateEmployee,
  validateEmployee,
} from "./employees-controllers";

const router = Router();

router.post("/signup", validateEmployee, signUpEmployee);
router.post("/signin", signInEmployee);
router.post("/forgot-password", employeeForgotPassword);
router.patch("/reset-password", employeeResetPassword);
router.get("/", getEmployees);
router.use(protectEmployee, sameEmployee);
router.patch("/update-password", employeeUpdatePassword);
router
  .route("/:id")
  .get(getEmployee)
  .delete(deleteEmployee)
  .patch(updateEmployee);

export default router;

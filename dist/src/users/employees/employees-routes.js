"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employees_controllers_1 = require("./employees-controllers");
const router = (0, express_1.Router)();
router.post("/signup", employees_controllers_1.validateEmployee, employees_controllers_1.signUpEmployee);
router.post("/signin", employees_controllers_1.signInEmployee);
router.post("/forgot-password", employees_controllers_1.employeeForgotPassword);
router.patch("/reset-password", employees_controllers_1.employeeResetPassword);
router.get("/", employees_controllers_1.getEmployees);
router.use(employees_controllers_1.protectEmployee, employees_controllers_1.sameEmployee);
router.patch("/update-password", employees_controllers_1.employeeUpdatePassword);
router
    .route("/:id")
    .get(employees_controllers_1.getEmployee)
    .delete(employees_controllers_1.deleteEmployee)
    .patch(employees_controllers_1.updateEmployee);
exports.default = router;

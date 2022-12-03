"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middlewares_1 = require("../users/user-middlewares");
const application_controllers_1 = require("./application-controllers");
const application_middleware_1 = require("./application-middleware");
const router = (0, express_1.Router)();
router.use(user_middlewares_1.protect);
router.post("/", (0, user_middlewares_1.restrictTo)("employee"), application_controllers_1.createApplication);
router.get("/user-applications", (0, user_middlewares_1.restrictTo)("employee"), application_controllers_1.getApplicationsByApplicant);
router.get("/user-applications/:id", (0, user_middlewares_1.restrictTo)("employee"), application_middleware_1.sameJobApplicant, application_controllers_1.getApplication);
router.delete("/user-applications/:id", (0, user_middlewares_1.restrictTo)("employee"), application_middleware_1.sameJobApplicant, application_controllers_1.deleteApplication);
router.get("/applications/:jobId", (0, user_middlewares_1.restrictTo)("employer"), application_controllers_1.getApplicationsByJobOwnerForAJob);
router.get("/:id/employer", (0, user_middlewares_1.restrictTo)("employer"), application_middleware_1.sameJobOwner, application_controllers_1.getAllApplicationsByJobOwner);
router.get("/employer/:id", (0, user_middlewares_1.restrictTo)("employer"), application_middleware_1.sameJobOwner, application_controllers_1.getApplication);
router.patch("/employer/:id", (0, user_middlewares_1.restrictTo)("employer"), application_middleware_1.sameJobOwner, application_controllers_1.updateApplication);
exports.default = router;

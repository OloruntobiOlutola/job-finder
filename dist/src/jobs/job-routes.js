"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middlewares_1 = require("../users/user-middlewares");
const job_controllers_1 = require("./job-controllers");
const job_middlewares_1 = require("./job-middlewares");
const router = (0, express_1.Router)();
router.route("/").get(job_controllers_1.getJobs).post(user_middlewares_1.protect, (0, user_middlewares_1.restrictTo)("employer"), job_controllers_1.createJob);
router.get("/jobs-for-me", user_middlewares_1.protect, (0, user_middlewares_1.restrictTo)("employee"), job_controllers_1.recommendedJobsHandler);
router.use(user_middlewares_1.protect, (0, user_middlewares_1.restrictTo)("employer"));
router
    .route("/:id")
    .get(job_middlewares_1.sameEmployer, job_controllers_1.getJob)
    .patch(job_middlewares_1.sameEmployer, job_controllers_1.updateJob)
    .delete(job_middlewares_1.sameEmployer, job_controllers_1.deleteJob);
exports.default = router;

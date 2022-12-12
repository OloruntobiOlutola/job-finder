import { Router } from "express";
import { protect, restrictTo } from "../users/user-middlewares";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  recommendedEmployeesHandler,
  recommendedJobsHandler,
  updateJob,
} from "./job-controllers";
import { sameEmployer } from "./job-middlewares";

const router = Router();

router.route("/").get(getJobs).post(protect, restrictTo("employer"), createJob);
router.get(
  "/jobs-for-me",
  protect,
  restrictTo("employee"),
  recommendedJobsHandler
);
router.get("/:id", getJob);
router.use(protect, restrictTo("employer"));
router.get(
  "/recommended-employer/:id",
  sameEmployer,
  recommendedEmployeesHandler
);
router
  .route("/:id")
  .get(sameEmployer, getJob)
  .patch(sameEmployer, updateJob)
  .delete(sameEmployer, deleteJob);

export default router;

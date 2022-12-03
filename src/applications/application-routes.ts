import { Router } from "express";
import { protect, restrictTo } from "../users/user-middlewares";
import {
  createApplication,
  deleteApplication,
  getAllApplicationsByJobOwner,
  getApplication,
  getApplicationsByApplicant,
  getApplicationsByJobOwnerForAJob,
  updateApplication,
} from "./application-controllers";
import { sameJobApplicant, sameJobOwner } from "./application-middleware";

const router = Router();

router.use(protect);

// Routes for Employee

router.post("/", restrictTo("employee"), createApplication);

router.get(
  "/user-applications",
  restrictTo("employee"),
  getApplicationsByApplicant
);

router.get(
  "/user-applications/:id",
  restrictTo("employee"),
  sameJobApplicant,
  getApplication
);

router.delete(
  "/user-applications/:id",
  restrictTo("employee"),
  sameJobApplicant,
  deleteApplication
);

// Routes for Employer

router.get(
  "/applications/:jobId",
  restrictTo("employer"),
  getApplicationsByJobOwnerForAJob
);

router.get(
  "/:id/employer",
  restrictTo("employer"),
  sameJobOwner,
  getAllApplicationsByJobOwner
);

router.get(
  "/employer/:id",
  restrictTo("employer"),
  sameJobOwner,
  getApplication
);

router.patch(
  "/employer/:id",
  restrictTo("employer"),
  sameJobOwner,
  updateApplication
);

export default router;

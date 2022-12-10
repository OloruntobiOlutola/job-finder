import { Router } from "express";
import { protect, restrictTo } from "../users/user-middlewares";
import {
  createProfile,
  cvFormatter,
  getProfile,
  updateProfile,
  uploadEmployeeCV,
} from "./profile-controllers";
import { sameProfileOwner } from "./profile-middlewares";

const router = Router();

router.use(protect, restrictTo("employee"));
router.post("/", uploadEmployeeCV, cvFormatter, createProfile);
router
  .route("/:id")
  .get(sameProfileOwner, getProfile)
  .patch(sameProfileOwner, updateProfile);

export default router;

import { Router } from "express";
import { protect, restrictTo } from "../users/user-middlewares";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "./profile-controllers";
import { sameProfileOwner } from "./profile-middlewares";

const router = Router();

router.use(protect, restrictTo("employee"));
router.post("/", createProfile);
router
  .route("/:id")
  .get(sameProfileOwner, getProfile)
  .patch(sameProfileOwner, updateProfile);

export default router;

import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  signIn,
  signUp,
  updatePassword,
} from "./user-auth-controllers";
import { protect, sameUser, validateUser } from "./user-middlewares";
import { deleteUser, getUser, getUsers, updateUser } from "./users-controllers";

const router = Router();

router.post("/signup", validateUser, signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.get("/", getUsers);
router.use(protect);
router.patch("/update-password/:id", sameUser, updatePassword);
router
  .route("/:id")
  .get(sameUser, getUser)
  .delete(sameUser, deleteUser)
  .patch(sameUser, updateUser);

export default router;

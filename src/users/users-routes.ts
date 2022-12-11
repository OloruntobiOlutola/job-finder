import { Router } from "express";
import {
  confirmUser,
  deleteUnconfirmedUsers,
  forgotPassword,
  logOut,
  resetPassword,
  signIn,
  signUp,
  updatePassword,
} from "./user-auth-controllers";
import {
  protect,
  restrictTo,
  sameUser,
  validateUser,
} from "./user-middlewares";
import { deleteUser, getUser, getUsers, updateUser } from "./users-controllers";

const router = Router();

router.post("/signup", validateUser, signUp);
router.post("/signin", signIn);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.get("/", getUsers);
router.get("/confirm-user/:token", confirmUser);
router.use(protect);
router.get("/logout", logOut);
router.patch("/update-password/:id", sameUser, updatePassword);
router
  .route("/:id")
  .get(sameUser, getUser)
  .delete(sameUser, deleteUser)
  .patch(sameUser, updateUser);
router.delete(
  "/delete-unconfirmed",
  restrictTo("admin"),
  deleteUnconfirmedUsers
);
router.get("/get-user/:id", restrictTo("employer", "admin"), getUser);

export default router;

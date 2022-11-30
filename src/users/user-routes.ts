import { Router } from "express";
import { signIn, signUp } from "./user-auth-controllers";
import { deleteUser, getUser, getUsers } from "./user-controllers";
import { validateUser } from "./user-middlewares";

const router = Router();

router.post("/signup", validateUser, signUp);
router.post("/signin", signIn);
router.route("/:id").get(getUser).delete(deleteUser);
router.get("/", getUsers);

export default router;

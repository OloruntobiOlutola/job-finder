"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_auth_controllers_1 = require("./user-auth-controllers");
const user_middlewares_1 = require("./user-middlewares");
const users_controllers_1 = require("./users-controllers");
const router = (0, express_1.Router)();
router.post("/signup", user_middlewares_1.validateUser, user_auth_controllers_1.signUp);
router.post("/signin", user_auth_controllers_1.signIn);
router.post("/forgot-password", user_auth_controllers_1.forgotPassword);
router.patch("/reset-password/:token", user_auth_controllers_1.resetPassword);
router.get("/", users_controllers_1.getUsers);
router.use(user_middlewares_1.protect);
router.patch("/update-password/:id", user_middlewares_1.sameUser, user_auth_controllers_1.updatePassword);
router
    .route("/:id")
    .get(user_middlewares_1.sameUser, users_controllers_1.getUser)
    .delete(user_middlewares_1.sameUser, users_controllers_1.deleteUser)
    .patch(user_middlewares_1.sameUser, users_controllers_1.updateUser);
exports.default = router;

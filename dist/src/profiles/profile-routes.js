"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middlewares_1 = require("../users/user-middlewares");
const profile_controllers_1 = require("./profile-controllers");
const profile_middlewares_1 = require("./profile-middlewares");
const router = (0, express_1.Router)();
router.use(user_middlewares_1.protect, (0, user_middlewares_1.restrictTo)("employee"));
router.post("/", profile_controllers_1.uploadEmployeeCV, profile_controllers_1.cvFormatter, profile_controllers_1.createProfile);
router
    .route("/:id")
    .get(profile_middlewares_1.sameProfileOwner, profile_controllers_1.getProfile)
    .patch(profile_middlewares_1.sameProfileOwner, profile_controllers_1.updateProfile);
exports.default = router;

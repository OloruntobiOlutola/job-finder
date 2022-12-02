"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = exports.getProfiles = exports.getProfile = exports.updateProfile = void 0;
const catch_async_1 = require("../../utils/catch-async");
const generic_controllers_1 = require("../../utils/generic-controllers");
const users_model_1 = __importDefault(require("../users/users-model"));
const profile_model_1 = __importDefault(require("./profile-model"));
exports.updateProfile = (0, generic_controllers_1.updateOne)(profile_model_1.default);
exports.getProfile = (0, generic_controllers_1.getOne)(profile_model_1.default);
exports.getProfiles = (0, generic_controllers_1.getAll)(profile_model_1.default);
exports.createProfile = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    req.body.userId = req.user?.id;
    const profile = await profile_model_1.default.create(req.body);
    const user = await users_model_1.default.findById(req.user?.id);
    user.hasProfile = true;
    user.save();
    res.status(201).json({
        status: "success",
        profile,
    });
});

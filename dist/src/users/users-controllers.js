"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUsers = exports.getUser = void 0;
const catch_async_1 = require("../../utils/catch-async");
const error_1 = require("../../utils/error");
const generic_controllers_1 = require("../../utils/generic-controllers");
const profile_model_1 = __importDefault(require("../profiles/profile-model"));
const users_model_1 = __importDefault(require("./users-model"));
exports.getUser = (0, generic_controllers_1.getOne)(users_model_1.default);
exports.getUsers = (0, generic_controllers_1.getAll)(users_model_1.default);
exports.updateUser = (0, generic_controllers_1.updateOne)(users_model_1.default);
exports.deleteUser = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const myProfile = await profile_model_1.default.findOne({ userId: req.user?.id });
    if (myProfile) {
        await profile_model_1.default.findOneAndDelete({ userId: req.user?.id });
    }
    const user = await users_model_1.default.findByIdAndDelete(req.params.id, {
        strict: true,
    });
    if (!user)
        return next(new error_1.ErrorObject(`User with the id ${req.params.id} not found`, 404));
    res.status(204).json({
        status: "success",
        data: null,
    });
});

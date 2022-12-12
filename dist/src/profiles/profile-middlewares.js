"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameProfileOwner = void 0;
const catch_async_1 = require("../../utils/catch-async");
const error_1 = require("../../utils/error");
const profile_model_1 = __importDefault(require("./profile-model"));
exports.sameProfileOwner = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const profile = await profile_model_1.default.findById(req.params.id);
    if (!profile) {
        new error_1.ErrorObject(`There's no profile with the given id`, 400);
    }
    if (req.user?.id !== profile?.userId?.toString()) {
        return next(new error_1.ErrorObject(`You're not authorised to perform this action`, 403));
    }
    next();
});

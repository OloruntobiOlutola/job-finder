"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameEmployer = void 0;
const catch_async_1 = require("../../utils/catch-async");
const error_1 = require("../../utils/error");
const job_model_1 = __importDefault(require("./job-model"));
exports.sameEmployer = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const job = await job_model_1.default.findById(req.params.id);
    if (req.user?.id !== job?.employerId?.toString()) {
        return next(new error_1.ErrorObject(`You're not authorised to perform this action`, 403));
    }
    next();
});

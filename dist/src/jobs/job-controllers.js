"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendedEmployeesHandler = exports.recommendedJobsHandler = exports.createJob = exports.deleteJob = exports.updateJob = exports.getJobs = exports.getJob = void 0;
const catch_async_1 = require("../../utils/catch-async");
const error_1 = require("../../utils/error");
const generic_controllers_1 = require("../../utils/generic-controllers");
const profile_model_1 = __importDefault(require("../profiles/profile-model"));
const users_model_1 = __importDefault(require("../users/users-model"));
const job_model_1 = __importDefault(require("./job-model"));
exports.getJob = (0, generic_controllers_1.getOne)(job_model_1.default);
exports.getJobs = (0, generic_controllers_1.getAll)(job_model_1.default);
exports.updateJob = (0, generic_controllers_1.updateOne)(job_model_1.default);
exports.deleteJob = (0, generic_controllers_1.deleteOne)(job_model_1.default);
exports.createJob = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    req.body.employerId = req.user?.id;
    const job = await job_model_1.default.create(req.body);
    res.status(201).json({
        status: "success",
        job,
    });
});
exports.recommendedJobsHandler = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const userProfile = await profile_model_1.default.findOne({ userId: req.user?.id });
    if (!userProfile) {
        return next(new error_1.ErrorObject("Please create your profile", 400));
    }
    const recommendedJobs = await job_model_1.default.find({
        skill: userProfile.skill,
        yearOfExperience: userProfile.yearsOfExperience,
    });
    if (!recommendedJobs) {
        return next(new error_1.ErrorObject("No job for your profile", 400));
    }
    res.status(200).json({
        status: "success",
        data: recommendedJobs,
    });
});
exports.recommendedEmployeesHandler = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const job = await job_model_1.default.findById(req.params.id);
    if (!job) {
        return next(new error_1.ErrorObject("No job with the requested Id", 400));
    }
    const recommendedEmployers = await users_model_1.default.find({
        skill: job.skill,
        yearsOfExperience: job.yearOfExperience,
    });
    if (!recommendedEmployers) {
        return next(new error_1.ErrorObject("No employee meets the job requirement", 400));
    }
    res.status(200).json({
        status: "success",
        data: recommendedEmployers,
    });
});

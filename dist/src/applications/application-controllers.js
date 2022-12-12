"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.createApplication = exports.getApplication = exports.getApplicationsByApplicant = exports.getAllApplicationsByJobOwner = exports.getApplicationsByJobOwnerForAJob = exports.updateApplication = void 0;
const catch_async_1 = require("../../utils/catch-async");
const error_1 = require("../../utils/error");
const generic_controllers_1 = require("../../utils/generic-controllers");
const job_model_1 = __importDefault(require("../jobs/job-model"));
const application_model_1 = __importDefault(require("./application-model"));
exports.updateApplication = (0, generic_controllers_1.updateOne)(application_model_1.default);
exports.getApplicationsByJobOwnerForAJob = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const applications = await application_model_1.default.find({ jobId: req.params.id });
    const job = await job_model_1.default.findById(req.params.id);
    if (req.user?.id !== job?.employerId?.toString()) {
        return next(new error_1.ErrorObject(`You're not authorised to perform this action`, 403));
    }
    res.status(200).json({
        status: "success",
        data: applications,
    });
});
exports.getAllApplicationsByJobOwner = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const applications = await application_model_1.default.find({
        employerId: req.user?.id,
    });
    res.status(200).json({
        status: "success",
        data: applications,
    });
});
exports.getApplicationsByApplicant = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const applications = await application_model_1.default.find({ employeeId: req.user?.id });
    res.status(200).json({
        status: "success",
        data: applications,
    });
});
exports.getApplication = (0, generic_controllers_1.getOne)(application_model_1.default);
exports.createApplication = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    req.body.employeeId = req.user?.id;
    const application = await application_model_1.default.create(req.body);
    res.status(201).json({
        status: "success",
        data: application,
    });
});
exports.deleteApplication = (0, generic_controllers_1.deleteOne)(application_model_1.default);

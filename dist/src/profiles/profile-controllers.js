"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = exports.cvFormatter = exports.uploadEmployeeCV = exports.getProfiles = exports.getProfile = exports.updateProfile = void 0;
const multer_1 = __importDefault(require("multer"));
const catch_async_1 = require("../../utils/catch-async");
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const error_1 = require("../../utils/error");
const generic_controllers_1 = require("../../utils/generic-controllers");
const users_model_1 = __importDefault(require("../users/users-model"));
const profile_model_1 = __importDefault(require("./profile-model"));
exports.updateProfile = (0, generic_controllers_1.updateOne)(profile_model_1.default);
exports.getProfile = (0, generic_controllers_1.getOne)(profile_model_1.default);
exports.getProfiles = (0, generic_controllers_1.getAll)(profile_model_1.default);
const multerStorage = multer_1.default.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        return "Please upload only an image file";
    }
};
const uploadCV = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.uploadEmployeeCV = uploadCV.single("cv");
exports.cvFormatter = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    if (req.file) {
        let id = req.user?.id;
        const user = await users_model_1.default.findById(id);
        if (!user) {
            return next(new error_1.ErrorObject(`There is no user with the ${req.params.id}`, 400));
        }
        const image = {
            url: req.file.path,
            id: req.params.id,
        };
        const result = await (0, cloudinary_1.default)(image);
        req.body.cv = result.secure_url;
    }
    next();
});
exports.createProfile = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    req.body.userId = req.user?.id;
    const profile = await profile_model_1.default.create(req.body);
    const user = await users_model_1.default.findById(req.user?.id);
    user.profile = profile.id;
    user.save();
    res.status(201).json({
        status: "success",
        profile,
    });
});

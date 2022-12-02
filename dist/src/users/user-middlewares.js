"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sameUser = exports.protect = exports.restrictTo = exports.validateUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt = __importStar(require("jsonwebtoken"));
const catch_async_1 = require("../../utils/catch-async");
const error_1 = require("../../utils/error");
const user_validation_1 = __importDefault(require("./user-validation"));
const users_model_1 = __importDefault(require("./users-model"));
exports.validateUser = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const payload = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
    };
    const { error } = await user_validation_1.default.validateAsync({ ...payload });
    if (error) {
        return next(new error_1.ErrorObject(`Error in User Data : ${error.message}`, 406));
    }
    next();
});
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role || "string")) {
            return next(new error_1.ErrorObject("You are not authorised to perform this action.", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.protect = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new error_1.ErrorObject("You are not logged in. Kindly log in.", 401));
    }
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET || "secret");
    const currentUser = await users_model_1.default.findById(decodedToken.id);
    if (!currentUser) {
        return next(new error_1.ErrorObject("Incorrect access token", 401));
    }
    req.user = currentUser;
    next();
});
exports.sameUser = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    if (req.user?.id !== req.params.id) {
        return next(new error_1.ErrorObject(`You're not authorised to perform this action`, 403));
    }
    next();
});

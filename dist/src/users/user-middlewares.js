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
exports.protect = exports.validateUser = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const catch_async_1 = require("../../utils/catch-async");
const error_1 = require("../../utils/error");
const user_validation_1 = __importDefault(require("./user-validation"));
const users_model_1 = __importDefault(require("./users-model"));
exports.validateUser = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const payload = { ...req.body };
    const { error } = user_validation_1.default.validate(payload);
    if (error) {
        return next(new error_1.ErrorObject(`Error in User Data : ${error.message}`, 406));
    }
    next();
});
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new error_1.ErrorObject("You are not authorised to perform this action.", 403));
        }
        next();
    };
};
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
    req.user = currentUser;
    next();
});

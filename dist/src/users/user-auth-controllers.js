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
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.signIn = exports.signUp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt = __importStar(require("jsonwebtoken"));
const catch_async_1 = require("../../utils/catch-async");
const error_1 = require("../../utils/error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const email_1 = __importDefault(require("../../utils/email"));
const crypto_1 = __importDefault(require("crypto"));
const users_model_1 = __importDefault(require("./users-model"));
const { JWT_COOKIE_EXPIRES_IN, JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } = process.env;
const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET || "my secret", {
        expiresIn: JWT_EXPIRES_IN,
    });
};
const createAndSendToken = (0, catch_async_1.catchAsync)(async (user, statusCode, res) => {
    const token = await signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() +
            parseInt(JWT_COOKIE_EXPIRES_IN || "1") * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
    };
    if (NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        user,
    });
});
exports.signUp = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const { email, name, password, passwordConfirm, role, phoneNumber } = req.body;
    const user = await users_model_1.default.create({
        email,
        name,
        password,
        passwordConfirm,
        role,
        phoneNumber,
    });
    createAndSendToken(user, 201, res);
});
exports.signIn = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new error_1.ErrorObject("Please enter your email and password", 400));
    }
    const user = await users_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new error_1.ErrorObject("Invalid email or password", 401));
    }
    const confirmPassword = await bcrypt_1.default.compare(password, user.password ? user.password : "pass");
    if (!confirmPassword || !user) {
        return next(new error_1.ErrorObject("Invalid email or password", 401));
    }
    createAndSendToken(user, 200, res);
});
exports.forgotPassword = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const user = await users_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new error_1.ErrorObject("There is no user with the provided email address", 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`;
    const message = `To reset your password click on the link below to submit your new password: ${resetUrl}`;
    try {
        await (0, email_1.default)({
            message,
            email: user.email || "email",
            subject: "Your password reset url. It's valid for 10mins",
        });
        res.status(200).json({
            status: "success",
            message: "Token has been sent to your mail",
            resetUrl,
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordTokenExpires = undefined;
        await user.save();
        next(new error_1.ErrorObject("Error while sending the token to your mail", 500));
    }
});
exports.resetPassword = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const hashToken = crypto_1.default
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await users_model_1.default.findOne({
        passwordResetToken: hashToken,
        passwordTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new error_1.ErrorObject("Token is invalid or it has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    user.passwordChangedAt = new Date(Date.now() - 1000);
    await user.save({ validateBeforeSave: true });
    createAndSendToken(user, 200, res);
});
exports.updatePassword = (0, catch_async_1.catchAsync)(async (req, res, next) => {
    const user = await users_model_1.default.findById(req.user.id).select("+password");
    const { newPassword, newPasswordConfirm } = req.body;
    if (!(await bcrypt_1.default.compare(req.body.password, user.password))) {
        return next(new error_1.ErrorObject("Your password is incorrect", 401));
    }
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();
    createAndSendToken(user, 200, res);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    password: {
        type: String,
        select: false,
    },
    skills: [String],
    experience: Number,
    location: String,
    passwordConfirm: String,
    phoneNumber: String,
    role: String,
    passwordResetToken: String,
    passwordChangedAt: Date,
    passwordTokenExpires: Date,
}, {
    timestamps: true,
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    let salt = await bcrypt_1.default.genSalt(10);
    this.password = await bcrypt_1.default.hash(this.password, salt);
    this.passwordConfirm = undefined;
    next();
});
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        console.log(JWTTimestamp < this.passwordChangedAt);
        return JWTTimestamp < this.passwordChangedAt;
    }
    return false;
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;

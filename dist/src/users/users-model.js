"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "The name field is required"],
        maxLength: [30, "A name must not be more than 30 characters"],
        minLength: [3, "A name must be at least 3 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email field is required for all users"],
        validate: [validator_1.default.isEmail, "Please enter a valid email"],
        unique: [true],
    },
    password: {
        type: String,
        required: [true, "A user must have an password"],
        select: false,
        minLength: [8, "Password must ba at least 8 characters"],
        validate: {
            validator: function (val) {
                return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/.test(val);
            },
            message: "Password must contain at least a number, a lowercase and an uppercase alphabeth",
        },
    },
    passwordConfirm: {
        type: String,
        required: [true, "A user must have an passwordConfirm"],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: "Password and confirm password are different",
        },
        select: false,
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function (val) {
                return /[0]{1}[0-9]{10}/.test(val);
            },
            message: "Please enter a valid phone number",
        },
    },
    role: {
        type: String,
        enum: ["employee", "employer", "admin"],
        default: "employee",
    },
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

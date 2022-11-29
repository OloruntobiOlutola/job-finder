"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const users_model_1 = __importDefault(require("./users-model"));
const lookup = async (email) => {
    const user = await users_model_1.default.findOne({ email: email });
    if (!user) {
        throw new Error("Email has been used before");
    }
};
const userValidation = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).trim(true).required(),
    email: joi_1.default.string().email().trim(true).required().external(lookup),
    phoneNumber: joi_1.default
        .string()
        .length(11)
        .pattern(/[0]{1}[0-9]{10}/)
        .required(),
    location: joi_1.default.string().required(),
    password: joi_1.default
        .string()
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/)
        .required(),
    passwordConfirm: joi_1.default.string().required().valid(joi_1.default.ref("password")),
    skills: joi_1.default.array().required(),
    experience: joi_1.default.number().required(),
    role: joi_1.default.string().valid("admin", "employee", "employer").required(),
});
exports.default = userValidation;
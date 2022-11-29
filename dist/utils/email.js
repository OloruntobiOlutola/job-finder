"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const { EMAIL_PASSWORD, EMAIL_USER } = process.env;
const sendEmail = async (options) => {
    const transport = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transport.sendMail(mailOptions);
};
exports.default = sendEmail;

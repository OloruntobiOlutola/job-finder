"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const error_1 = require("./error");
const { NODE_ENV } = process.env;
console.log(NODE_ENV);
const handleCastError = (err) => {
    let message = `The ${err.path} does not contain ${err.value}`;
    return new error_1.ErrorObject(message, 400);
};
const handleWebTokenError = (err) => new error_1.ErrorObject(err.message, 401);
const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack,
    });
};
const prodError = (err, res) => {
    if (err.operational === true) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        res.status(err.statusCode ? err.statusCode : 500).json({
            status: "error",
            message: "Something went wrong",
        });
    }
};
const ErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (NODE_ENV === "development") {
        devError(err, res);
    }
    else {
        let error = { ...err };
        if (error.name === "CastError")
            error = handleCastError(error);
        if (error.name === "JsonWebTokenError")
            error = handleWebTokenError(error);
        prodError(err, res);
    }
    next();
};
exports.default = ErrorHandler;

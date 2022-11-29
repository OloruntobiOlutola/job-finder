"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorObject = void 0;
class ErrorObject extends Error {
    message;
    statusCode;
    status;
    operational;
    constructor(message, statusCode, status, operational) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.status = status;
        this.operational = operational;
        this.statusCode = statusCode;
        this.status = `${this.statusCode}.startsWith(4)` ? "fail" : "error";
        this.operational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ErrorObject = ErrorObject;

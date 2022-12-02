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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const users_routes_1 = __importDefault(require("./src/users/users-routes"));
const profile_routes_1 = __importDefault(require("./src/profiles/profile-routes"));
const job_routes_1 = __importDefault(require("./src/jobs/job-routes"));
const error_1 = require("./utils/error");
const error_controller_1 = __importDefault(require("./utils/error-controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "20kb" }));
app.use((0, helmet_1.default)());
const allowedOrigins = ["http://localhost:3000"];
const options = {
    origin: allowedOrigins,
};
app.use((0, cors_1.default)(options));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, xss_clean_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: "Too many request from the same IP address. Try again in 1 hour time.",
});
app.use("/api", limiter);
app.use(express_1.default.static(`${__dirname}/public`));
const accessLogStream = fs.createWriteStream(path_1.default.join(__dirname, "access.log"), { flags: "a" });
app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
app.use("/api/v1/users", users_routes_1.default);
app.use("/api/v1/profiles", profile_routes_1.default);
app.use("/api/v1/jobs", job_routes_1.default);
app.all("*", (req, res, next) => {
    const err = new error_1.ErrorObject(`${req.protocol}://${req.get("host")}${req.url} not found`, 404);
    next(err);
});
app.use(error_controller_1.default);
exports.default = app;

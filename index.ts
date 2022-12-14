import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import * as fs from "fs";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import userRouter from "./src/users/users-routes";
import profileRouter from "./src/profiles/profile-routes";
import jobRouter from "./src/jobs/job-routes";
import applicationRouter from "./src/applications/application-routes";
import { ErrorObject } from "./utils/error";
import ErrorHandler from "./utils/error-controller";

const app: Express = express();

// Middlewares

// body parser
app.use(express.json({ limit: "70kb" }));

app.use(cookieParser());

// Set security headers
app.use(helmet());

// Cors
const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

// Sanitize the data going to the db
app.use(mongoSanitize());

// Sanitize against xss
app.use(xss());

// rate limiting for the same IP address
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message:
    "Too many request from the same IP address. Try again in 1 hour time.",
});
app.use("/api", limiter);

// Using Static files
app.use(express.static(`${__dirname}/public`));

// setup the logger
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applications", applicationRouter);
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorObject(
    `${req.protocol}://${req.get("host")}${req.url} not found`,
    404
  );
  next(err);
});

// Error Handling
app.use(ErrorHandler);

export default app;
